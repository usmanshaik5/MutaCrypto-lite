const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mailSender_payment = require("../utils/mailSender_payment");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


//initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, mesage: "Could not Initiate Order" });
  }
};

//verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll karwao student ko
    await enrollStudents(courses, userId, res);
    //return res
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: "false", message: "Payment Failed" });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please Provide data for Courses or UserId",
      });
  }

  for (const courseId of courses) {
    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not Found" });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      //find the student and add the course to their list of enrolledCOurses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      ///bachhe ko mail send kardo
      const emailResponse = await mailSender(
        enrollStudents.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
      //console.log("Email Sent Successfully", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
var am;
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  am = amount;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    //student ko dhundo
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};


// Generate PDF function
const generateInvoice = (studentName, courseName, amountPaid) => {
  const invoicesDir = path.join(__dirname, "invoices");

  // Check if the 'invoices' directory exists; if not, create it
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const filePath = path.join(invoicesDir, `${studentName}-invoice.pdf`);

  // Create the PDF document
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // ** Header **
  doc
    .fontSize(20)
    .text("MutaLearn Education", 110, 57)
    .fontSize(10)
    .text("MutaLearn Inc.", 200, 50, { align: "right" })
    .text("1234 Address St.", 200, 65, { align: "right" })
    .text("City, ST 12345", 200, 80, { align: "right" })
    .moveDown();

  // ** Invoice Title and Date **
  doc
    .fontSize(28)
    .text("INVOICE", { align: "center" })
    .fontSize(12)
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" })
    .moveDown();

  // ** Student Details **
  doc
    .fontSize(14)
    .text("Bill To:", 50, 200)
    .fontSize(12)
    .text(`Student Name: ${studentName}`, 50, 220)
    .text(`Course Name: ${courseName}`, 50, 240)
    .moveDown();

  // ** Amount Paid Section **
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(`Amount Paid: $${amountPaid}`, { align: "center" })
    .moveDown();

  // ** Footer - Thank You Note**
  doc
    .fontSize(12)
    .text(
      "Thank you for your purchase! If you have any questions, feel free to contact us at support@mutalearn.com.",
      50,
      500,
      { align: "center", width: 500 }
    )
    .moveDown();

  // ** Adding a border around the page (Optional) **
  doc.strokeColor("#aaaaaa").lineWidth(2).rect(50, 50, 500, 700).stroke();

  // ** End the document **
  doc.end();

  return filePath;
};


console.log(generateInvoice);

exports.purchaseDirectly = async (req, res) => {
  const { courseId, courses } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Login first" });
  }

  if (!courseId && courses) {
    //check whether courses is an array or not
    if (Array.isArray(courses)) {
      for (let index = 0; index < courses.length; index++) {
        try {
          //Find the course and enroll the student in it
          const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courses[index] },
            { $push: { studentsEnrolled: userId } },
            { new: true }
          );
          if (!enrolledCourse) {
            return res.status(500).json({
              success: false,
              error: "Course not found",
            });
          }
          console.log("Updated course: ", enrolledCourse);

          const courseProgress = await CourseProgress.create({
            courseID: courses[index],
            userId: userId,
            completedVideos: [],
          });
          //Find the student and add the course to their list of enrolled courses
          const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            {
              $push: {
                courses: courses[index],
                courseProgress: courseProgress._id,
              },
            },
            { new: true }
          );
          console.log("Updated student: ", enrolledStudent);

          //Send an email notification to the enrolled student
          const pdfPath = generateInvoice(
            enrolledStudent.firstName,
            enrolledCourse.courseName,
          );

          await mailSender_payment(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(
              enrolledCourse.courseName,
              `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
            ),
            pdfPath
          );
        } catch (error) {
          console.log(error);
          return res.status(400).json({
            success: false,
            error: error.message,
          });
        }
      }
      return res
        .status(200)
        .json({ success: true, message: "Student Enrolled" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide courseIds" });
    }
  }

  try {
    // Find the course and enroll the student in it
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      return res
        .status(500)
        .json({ success: false, error: "Course not found" });
    }
    console.log("Updated course: ", enrolledCourse);

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });
    // Find the student and add the course to their list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );
 const pdfPath1 = await generateInvoice(
   enrolledStudent.firstName,
   enrolledCourse.courseName,
   100
 );
 console.log(enrolledStudent.firstName);
 console.log(enrolledCourse.courseName);
 console.log(pdfPath1);



    // Send an email notification to the enrolled student
    await mailSender_payment(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      ),
      pdfPath1,
    );
    return res.status(200).json({ success: true, message: "Student Enrolled" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }

// };

// //verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {3
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });

//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }

// };
