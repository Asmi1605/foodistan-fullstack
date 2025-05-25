const express = require("express");
const app = express();
const path = require("path");

let fileUpload = require("express-fileupload");

const cors = require("cors");

const bodyParser = require("body-parser");
let session = require("express-session");

const mysql = require("mysql");
const { log } = require("console");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

// database connection

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_delievery_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("connection created with db");
});

//insert AdminRegistrtaion data

app.post("/api/addAdmin", (req, res) => {
  const { fullname, email, pno, gender, npass } = req.body;
  console.log("reached here!!");
  const sqlInsert =
    "INSERT INTO admin (full_name , email , phone , gender , password) VALUES (? , ? , ? , ? , ?)";
  db.query(
    sqlInsert,
    [fullname, email, pno, gender, npass],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        res.send({ msg: "email/phone already exiist" });
      }

      //if(result){
      //	res.send(result);
      //}
      //else{
      //	res.send({msg: "Something wrong Happened!! Try again after some time"});
      //}
    }
  );
});

// login and logout admin
app.get("/api/Admin-logout", (req, res) => {
  session.SubAdmin = undefined;
  res.send("logout");
});

app.get("/api/check-subadmin-logged-in", (req, res) => {
  if (session.SubAdmin === undefined) {
    res.send({ AdminloggedIn: false });
  } else {
    res.send({ AdminloggedIn: true, SubAdmin: session.SubAdmin });
  }
});

app.post("/api/loginAdmin", async (req, res) => {
  const { email, password } = req.body;
  console.log("reached here!!");
  const sqllogin1 = "SELECT * from admin WHERE email = ? and password = ?";
  db.query(sqllogin1, [email, password], (error, result1) => {
    if (error) {
      res.send({ error });
    }

    if (result1.length > 0) {
      console.log("result1 is ", result1);
      if (result1[0].status === "blocked") {
        const phoneAdmin = result1[0].phone;
        const sqlAdminIsBlockedOrUnblocked =
          "SELECT r_id from admin_restaurant WHERE adminphone = ?";
        db.query(
          sqlAdminIsBlockedOrUnblocked,
          [phoneAdmin],
          (error1, result2) => {
            if (error1) {
              res.send({ error1 });
            }
            if (result2.length > 0) {
              console.log("result2 is ", result2);
              console.log("result2 r_id is ", result2[0].r_id);

              const restaurant_id = result2[0].r_id;
              const NoOfPendingAndPreparing =
                "SELECT Count(bd_id) as cnt FROM `bill_details` WHERE (status_for_admin = 'Pending' || status_for_admin = 'Preparing' || status_for_admin = 'Prepared') AND r_id = ?;";

              db.query(
                NoOfPendingAndPreparing,
                [restaurant_id],
                (error2, result3) => {
                  if (error2) {
                    res.send({ error2 });
                  }

                  console.log("result3 count is : ", result3[0].cnt);
                  if (result3[0].cnt > 0) {
                    console.log("reached here when cnt > 0");
                    const UpdateAdminStatus =
                      "UPDATE `admin` SET `status`= 'Have Pending Orders' WHERE `phone` = ?";

                    db.query(
                      UpdateAdminStatus,
                      [phoneAdmin],
                      (error3, result4) => {
                        if (error3) {
                          res.send({ error3 });
                        }

                        console.log("result4 is : ", result4.affectedRows);
                        if (result4) {
                          if (result4.affectedRows === 1) {
                            const sqllogin3 =
                              "SELECT * from admin WHERE email = ? and password = ?";
                            db.query(
                              sqllogin3,
                              [email, password],
                              (error7, result7) => {
                                if (error7) {
                                  res.send({ error7 });
                                }
                                if (result7.length > 0) {
                                  let adminData = {
                                    email: result1[0].email,
                                    full_name: result1[0].full_name,
                                    phone: result1[0].phone,
                                  };
                                  session.SubAdmin = adminData;
                                  res.send(result7);
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  } else {
                    console.log("reached here when cnt === 0");
                    let adminData = {
                      email: result1[0].email,
                      full_name: result1[0].full_name,
                      phone: result1[0].phone,
                    };
                    session.SubAdmin = adminData;
                    res.send(result1);
                  }
                }
              );
            } else {
              console.log("reached here when cnt === 0");
              let adminData = {
                email: result1[0].email,
                full_name: result1[0].full_name,
                phone: result1[0].phone,
              };
              session.SubAdmin = adminData;
              res.send(result1);
            }
          }
        );
      }
      if (result1[0].status === "Have Pending Orders") {
        const phoneAdmin = result1[0].phone;
        const sqlAdminIsBlockedOrUnblocked =
          "SELECT r_id from admin_restaurant WHERE adminphone = ?";
        db.query(
          sqlAdminIsBlockedOrUnblocked,
          [phoneAdmin],
          (error1, result2) => {
            if (error1) {
              res.send({ error1 });
            }
            if (result2.length > 0) {
              console.log("result2 is ", result2);
              console.log("result2 r_id is ", result2[0].r_id);

              const restaurant_id = result2[0].r_id;
              const NoOfPendingAndPreparing =
                "SELECT Count(bd_id) as cnt FROM `bill_details` WHERE (status_for_admin = 'Pending' || status_for_admin = 'Preparing' || status_for_admin = 'Prepared') AND r_id = ?;";

              db.query(
                NoOfPendingAndPreparing,
                [restaurant_id],
                (error2, result3) => {
                  if (error2) {
                    res.send({ error2 });
                  }

                  console.log("result3 count is : ", result3[0].cnt);
                  if (result3[0].cnt > 0) {
                    const UpdateAdminStatus =
                      "UPDATE `admin` SET `status`= 'Have Pending Orders' WHERE `phone` = ?";

                    db.query(
                      UpdateAdminStatus,
                      [phoneAdmin],
                      (error3, result4) => {
                        if (error3) {
                          res.send({ error3 });
                        }

                        console.log("result4 is : ", result4.affectedRows);
                        if (result4) {
                          if (result4.affectedRows === 1) {
                            let adminData = {
                              email: result1[0].email,
                              full_name: result1[0].full_name,
                              phone: result1[0].phone,
                            };
                            session.SubAdmin = adminData;
                            res.send(result1);
                          }
                        }
                      }
                    );
                  }
                  if (result3[0].cnt === 0) {
                    console.log("reached here where count === 0");
                    const UpdateAdminStatus =
                      "UPDATE `admin` SET `status`= 'blocked' WHERE `phone` = ?";
                    db.query(
                      UpdateAdminStatus,
                      [phoneAdmin],
                      (error3, result4) => {
                        if (error3) {
                          res.send({ error3 });
                        }

                        console.log("result4 is : ", result4.affectedRows);
                        if (result4) {
                          if (result4.affectedRows === 1) {
                            const sqllogin2 =
                              "SELECT * from admin WHERE email = ? and password = ?";
                            db.query(
                              sqllogin2,
                              [email, password],
                              (error6, result6) => {
                                if (error6) {
                                  res.send({ error6 });
                                }
                                if (result6.length > 0) {
                                  let adminData = {
                                    email: result1[0].email,
                                    full_name: result1[0].full_name,
                                    phone: result1[0].phone,
                                  };
                                  session.SubAdmin = adminData;
                                  res.send(result6);
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  } else {
                    let adminData = {
                      email: result1[0].email,
                      full_name: result1[0].full_name,
                      phone: result1[0].phone,
                    };
                    session.SubAdmin = adminData;
                    res.send(result1);
                  }
                }
              );
            } else {
              let adminData = {
                email: result1[0].email,
                full_name: result1[0].full_name,
                phone: result1[0].phone,
              };
              session.SubAdmin = adminData;
              res.send(result1);
            }
          }
        );
      }
      if (result1[0].status === "active") {
        console.log("reached here when cnt === Outside ekdum bahar waala");
        let adminData = {
          email: result1[0].email,
          full_name: result1[0].full_name,
          phone: result1[0].phone,
        };
        session.SubAdmin = adminData;
        res.send(result1);
      }
      if (result1[0].status === "pending") {
        console.log("reached here status is pendng");
        res.send(result1);
      }
    } else {
      res.send({ message: "wrong password / username combination" });
    }
  });
});

//super admin login and logout

app.get("/api/SuperAdmin-logout", (req, res) => {
  session.superAdmin = undefined;
  res.send("logout");
});

app.get("/api/check-superadmin-logged-in", (req, res) => {
  if (session.superAdmin === undefined) {
    res.send({ SuperAdminloggedIn: false });
  } else {
    res.send({ SuperAdminloggedIn: true, superAdmin: session.superAdmin });
  }
});

app.post("/api/loginSuperAdmin", (req, res) => {
  const { email, password } = req.body;
  console.log("reached here!!");
  const sqlSuperlogin =
    "SELECT * from super_admin WHERE super_email = ? and password = ?";
  db.query(sqlSuperlogin, [email, password], (error, result) => {
    if (error) {
      res.send({ error });
    }

    if (result.length > 0) {
      let SuperadminData = { name: result[0].name };
      session.superAdmin = SuperadminData;
      res.send(result);
    } else {
      res.send({ message: "wrong password / username combination" });
    }
  });
});

//Rider Login

app.get("/api/rider-logout", (req, res) => {
  session.rider = undefined;
  res.send("logout");
});

app.get("/api/check-rider-logged-in", (req, res) => {
  if (session.rider === undefined) {
    res.send({ RiderloggedIn: false });
  } else {
    res.send({ RiderloggedIn: true, rider: session.rider });
  }
});

app.post("/api/loginrider", (req, res) => {
  const { email, password } = req.body;
  console.log("reached here!!");
  const sqlriderlogin =
    "SELECT * from delieveryrider WHERE gmail = ? and password = ?";
  db.query(sqlriderlogin, [email, password], (error, result) => {
    if (error) {
      res.send({ error });
    }

    if (result.length > 0) {
      let riderData = {
        Name: result[0].Name,
        phone: result[0].phone,
        DL_today: result[0].DL_Today,
        status: result[0].status,
      };

      session.rider = riderData;
      console.log(result[0]);
      res.send(result);
    } else {
      res.send({ message: "wrong password / username combination" });
    }
  });
});

//change password admin email verification for both cange password and restaurant admin

app.post("/api/emailverification", (req, res) => {
  const { email } = req.body;
  console.log("reached here!!");
  const sqlEmailVerifictaion = "SELECT * from admin WHERE email = ?";
  db.query(sqlEmailVerifictaion, [email], (error, result) => {
    console.log("error", error);

    if (error) {
      res.send({ error });
    }
    console.log("result", result);

    if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ message: "Email Not Exist" });
    }
  });
});

app.put("/api/changepasswordadmin", (req, res) => {
  const { email, password } = req.body;

  console.log("reached here!! here body is " + req.body);
  const sqlChangePassword =
    "UPDATE `admin` SET `password`= ? WHERE `email` = ?";

  db.query(sqlChangePassword, [password, email], (error, result) => {
    if (error) {
      res.send({ error });
      console.log("errro is : " + error);
    }

    if (result) {
      res.send(result);
      console.log("the result is " + result);
    }
  });
});

//restautrant admin verification

app.post("/api/phoneverificationRestaurantAdmin", (req, res) => {
  const { adminphone } = req.body;
  console.log("reached here!!");
  const sqlphoneVerifictaionRes = "SELECT * from admin WHERE phone = ?";

  db.query(sqlphoneVerifictaionRes, [adminphone], (error, result) => {
    console.log("error", error);
    if (error) {
      res.send({ error });
    }

    console.log("result", result);
    if (result) {
      res.send(result);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/adminhasalreadyres", (req, res) => {
  const { adminphone } = req.body;
  console.log("reached here!!");
  const sqladminhasalreadyres =
    "SELECT * from admin_restaurant WHERE adminphone = ?";

  db.query(sqladminhasalreadyres, [adminphone], (error, result) => {
    console.log("error", error);
    if (error) {
      res.send({ error });
    }

    console.log("result", result);
    if (result) {
      res.send(result);
    } else {
      res.send(result);
    }
  });
});

// add restaurant

app.post("/api/addRestaurant", (req, res) => {
  console.log("req.body is :" + req.body);

  const { resname, resaddress, reslandmark, rescity, adminphone } = req.body;

  let resphoto = req.files.resphoto;
  let resPhotoPath = `public/images/res_images/${resphoto.name}`;
  let resPhotoPathDB = `res_images/${resphoto.name}`;

  resphoto.mv(resPhotoPath, (e) => {
    if (e) {
      return res.send("error in file upload");
      //console.log(e);
    }
   
    console.log('reached here as photo has no error');
    const sqlInsert =
      "INSERT INTO admin_restaurant (resphoto , resname , resaddress , reslandmark , rescity , adminphone) VALUES (? , ? , ? , ? , ? , ? )";
    db.query(
      sqlInsert,
      [resPhotoPathDB, resname, resaddress, reslandmark, rescity, adminphone],
      (error, result) => {
        console.log(error);
        if (error) {
          res.send({message: "Something wrong Happened!! Try again after some time"});
        }
        if (result) {
          res.send(result);
        }
      }
    );
  });

  //console.log("reached here!!");
});

// get admin data for super admin

app.get("/api/getAdmindata", (req, res) => {
  const sqlseladmindata = "SELECT * from admin";

  db.query(sqlseladmindata, (err, result) => {
    res.send(result);
  });
});

// get restaurant data for super admin

app.get("/api/getResdata", (req, res) => {
  const sqlselResdata = "SELECT * from admin_restaurant";

  db.query(sqlselResdata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getResdataActiveStatus", (req, res) => {
  const sqlselResdataActive =
    "SELECT * from admin_restaurant WHERE res_status = 'active'";

  db.query(sqlselResdataActive, (err, result) => {
    res.send(result);
  });
});

//activate admin

app.put("/api/ActiveAdmin/:id", (req, res) => {
  const { id } = req.params;
  const sqlActiveAdmin = "UPDATE `admin` SET `status`= 'active' WHERE `id` = ?";
  console.log(sqlActiveAdmin);
  db.query(sqlActiveAdmin, [id], (error, result) => {
    if (error) {
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

//block admin

app.put("/api/BlockAdmin/:id", (req, res) => {
  const { id } = req.params;
  const sqlBlockAdmin = "UPDATE `admin` SET `status`= 'blocked' WHERE `id` = ?";
  console.log(sqlBlockAdmin);
  db.query(sqlBlockAdmin, [id], (error, result) => {
    if (error) {
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

// active resturant

app.put("/api/ActiveRes/:id", (req, res) => {
  const { id } = req.params;
  const sqlActiveRes =
    "UPDATE `admin_restaurant` SET `res_status`= 'active' WHERE `r_id` = ?";
  console.log(sqlActiveRes);
  db.query(sqlActiveRes, [id], (error, result) => {
    if (error) {
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

//block restaurant

app.put("/api/BlockRes/:id", (req, res) => {
  const { id } = req.params;
  const sqlBlockRes =
    "UPDATE `admin_restaurant` SET `res_status`= 'blocked' WHERE `r_id` = ?";
  console.log(sqlBlockRes);
  db.query(sqlBlockRes, [id], (error, result) => {
    if (error) {
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

// ADMIN PROFILE PAGE

app.post("/api/profile", (req, res) => {
  const { phone } = req.body;
  console.log(`under profile number is ` + phone);
  const sqladminprofile = "SELECT * FROM `admin` WHERE phone = ?";
  console.log(sqladminprofile);
  db.query(sqladminprofile, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(`profile resutlt is ${result}`);
      res.send(result);
    }
  });
});

app.post("/api/profile2", (req, res) => {
  const { phone } = req.body;
  console.log(`profile2 phone is ${phone}`);
  const sqlResProfile = "SELECT * FROM `admin_restaurant` WHERE adminphone = ?";
  console.log(sqlResProfile);
  db.query(sqlResProfile, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(`profile2 resutlt is ${result}`);
      res.send(result);
    }
  });
});

app.post("/api/hasFoodorNot", (req, res) => {
  const { r_id } = req.body;
  console.log(`under profile r_id is ` + r_id);
  const sqlhasItems = "SELECT * FROM `food` WHERE r_id = ?";
  console.log(sqlhasItems);
  db.query(sqlhasItems, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

// admin dashboard add food
app.post("/api/addFood", (req, res) => {
  console.log(req.body);
  const {
    food_name,
    food_description,
    actual_price,
    category,
    subcategory,
    r_id,
    restaurant_phone,
    selling_price,
    discount,
    profit,
    main_price_for_profit,
    discount_to_be_shown,
    total_discount_for_customer,
  } = req.body;

  console.log(req.files);
  let cover_image = req.files.cover_image;
  let cover_imagePath = `public/images/food_image/${cover_image.name}`;
  let cover_imagePathDB = `food_image/${cover_image.name}`;

  cover_image.mv(cover_imagePath, (e) => {
    if (e) {
      console.log(e);
      return res.send("Error in file upload");
    }
    const sqlInsertFood =
      "INSERT INTO `food`(`food_name`, `food_description`, `cover_image`, `actual_price`, `category`, `subcategory` , `r_id`, `restaurant_phone`, `price`, `discount`, `profit` , `main_price_for_profit` , `discount_to_be_shown` , `total_discount_for_customer`) VALUES (?,?,?,?,?,?,?,?,? ,? ,? ,? ,? , ?)";
    db.query(
      sqlInsertFood,
      [
        food_name,
        food_description,
        cover_imagePathDB,
        actual_price,
        category,
        subcategory,
        r_id,
        restaurant_phone,
        selling_price,
        discount,
        profit,
        main_price_for_profit,
        discount_to_be_shown,
        total_discount_for_customer,
      ],
      (error, result) => {
        console.log(error);
        if (error) {
          res.send(error);
        }
        if (result) {
          res.send(result);
        } else {
          res.send({
            message: "Something wrong Happened!! Try again after some time",
          });
        }
      }
    );
  });
  //console.log(`profit is ${profit}`);
});

//user side Logics

app.post("/api/addUser", (req, res) => {
  const {
    user_email,
    user_mobile,
    user_password,
    uname,
    user_address,
    user_city,
    user_state,
  } = req.body;
  console.log("reached here!!");
  const sqlInsertUser =
    "INSERT INTO `users`(`user_email`, `user_mobile`, `user_password`, `uname`, `user_address` , `user_city` , `user_state`) VALUES (? , ? , ? , ? , ? , ? ,?)";
  db.query(
    sqlInsertUser,
    [
      user_email,
      user_mobile,
      user_password,
      uname,
      user_address,
      user_city,
      user_state,
    ],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        res.send({ msg: "email/phone already exiist" });
      }
    }
  );
});

//user login and logout

app.get("/api/User-logout", (req, res) => {
  session.User = undefined;
  res.send("logout");
});

app.get("/api/check-user-logged-in", (req, res) => {
  if (session.User === undefined) {
    res.send({ UserLoggedIn: false });
  } else {
    res.send({ UserLoggedIn: true, User: session.User });
  }
});

app.post("/api/loginUser", (req, res) => {
  const { user_email, user_password } = req.body;
  console.log("reached here!!");
  const sqlloginUser =
    "SELECT * from users WHERE user_email = ? and user_password = ?";
  db.query(sqlloginUser, [user_email, user_password], (error, result) => {
    if (error) {
      res.send({ error });
    }

    if (result.length > 0) {
      let userData = {
        user_id: result[0].user_id,
        user_email: result[0].user_email,
        uname: result[0].uname,
        user_mobile: result[0].user_mobile,
        user_id: result[0].user_id,
        user_address: result[0].user_address,
        user_city: result[0].user_city,
        user_state: result[0].user_state,
      };
      session.User = userData;
      res.send(result);
    } else {
      res.send({ message: "wrong password / username combination" });
    }
  });
});

//user email verification

app.post("/api/emailverificationUser", (req, res) => {
  const { user_email } = req.body;
  console.log("reached here!!");
  const sqlEmailVerifictaionUser = "SELECT * from users WHERE user_email = ?";
  db.query(sqlEmailVerifictaionUser, [user_email], (error, result) => {
    console.log("error", error);

    if (error) {
      res.send({ error });
    }
    console.log("result", result);

    if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ message: "Email Not Exist" });
    }
  });
});

//forgot password user

app.put("/api/forgotpasswordUser", (req, res) => {
  const { user_email, user_password } = req.body;

  console.log("reached here!! here body is " + req.body);
  const sqlForgotPassword =
    "UPDATE `users` SET `user_password`= ? WHERE `user_email` = ?";

  db.query(sqlForgotPassword, [user_password, user_email], (error, result) => {
    if (error) {
      res.send({ error });
      console.log("errror is : " + error);
    }

    if (result) {
      res.send(result);
      console.log("the result is " + result);
    }
  });
});

// cehck email already present or not

app.post("/api/UpdateUser", (req, res) => {
  const {
    user_id,
    user_email,
    user_mobile,
    uname,
    user_address,
    user_city,
    user_state,
    oldnumber,
  } = req.body;

  console.log("reached here!! here body is " + req.body);
  const sqlUpdateUser =
    "UPDATE `users` SET `user_email`= ? , `user_mobile`= ? , `uname`= ? , `user_address`= ? , `user_city`= ? , `user_state`= ?  WHERE `user_id` = ?";

  db.query(
    sqlUpdateUser,
    [
      user_email,
      user_mobile,
      uname,
      user_address,
      user_city,
      user_state,
      user_id,
    ],
    (error, result) => {
      if (error) {
        res.send(error.code);
        console.log("errpr is ", error.code);
      }

      if (result) {
        if (result.affectedRows === 1) {
          const sqlUpdateUserBill =
            "UPDATE `bill` SET `user_mobile`= ? WHERE `user_mobile` = ?";

          db.query(
            sqlUpdateUserBill,
            [user_mobile, oldnumber],
            (error2, result2) => {
              if (error2) {
                res.send(error2.code);
                console.log("errpr is ", error2.code);
              }
              if (result2) {
                if (result2.affectedRows === 1) {
                  res.send(result);
                  console.log("result is ", result);
                }
                if (result2.affectedRows === 0) {
                  res.send(result);
                  console.log("result is ", result);
                }
              }
            }
          );
        }
      }
    }
  );
});

//res.send(result);
//console.log("result is ", result);
//userhome

//show all food items on user home

app.get("/api/showAllFood", (req, res) => {
  const sqlAllFood = "SELECT * from `food`";

  db.query(sqlAllFood, (err, result) => {
    res.send(result);
  });
});

app.get("/api/showAllFoodAccToResStatus", (req, res) => {
  const sqlAllFood =
    "SELECT * from `food` INNER JOIN admin_restaurant ON food.r_id=admin_restaurant.r_id where admin_restaurant.res_status = 'active'";

  db.query(sqlAllFood, (err, result) => {
    //console.log(result.);
    res.send(result);
  });
});

//show all the restaurant detail with id

app.post("/api/restaurantDetailView", (req, res) => {
  const { r_id } = req.body;

  const sqlResDetailView = "SELECT * FROM `admin_restaurant` WHERE r_id = ?";
  console.log(sqlResDetailView);
  db.query(sqlResDetailView, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(`profile2 resutlt is ${result}`);
      res.send(result);
    }
  });
});

app.post("/api/showAllFoodRelatedtoRes", (req, res) => {
  const { r_id } = req.body;

  const sqlViewResFoods = "SELECT * FROM `food` WHERE r_id = ?";

  db.query(sqlViewResFoods, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

app.post("/api/checkOut", (req, res) => {
  const {
    user_id,
    user_address,
    user_city,
    user_state,
    Notes_abt_address,
    items,
    cartTotal,
    date,
    time,
    Payment_Method,
    user_mobile,
  } = req.body;

  let paid_to_restaurant = Payment_Method === 'Online' ? 'Yes' : 'No' ;
  const sqlInsertBill =
    "INSERT INTO `bill`(`grandTotal`, `Date`, `Time`, `payment_Method`, `user_Id`, `full_address`, `city`, `state`, `address_remarks` , `user_mobile` , `paid_to_restaurant`) VALUES (? , ? , ? , ? , ? , ? ,? , ? ,? , ? , ?)";

  db.query(
    sqlInsertBill,
    [
      cartTotal,
      date,
      time,
      Payment_Method,
      user_id,
      user_address,
      user_city,
      user_state,
      Notes_abt_address,
      user_mobile,
      paid_to_restaurant
    ],
    (error, result) => {
      if (error) {
        res.send({ error });
      } else {
        const message = result.insertId;

        for (let i = 0; i < items.length; i++) {
          const detailsdata = {
            bill_id: result.insertId,
            food_id: items[i].id,
            payment_received: Payment_Method === 'Online' ?  'Yes' : 'No'
            ,
            r_id: items[i].r_id,
            quantity: items[i].quantity,
            food_price: items[i].price,
            total_price: items[i].itemTotal,
            profitt: items[i].profit * items[i].quantity,
          };
          let sqll = "INSERT INTO `bill_details` SET ?";
          db.query(sqll, detailsdata, (er, resu) => {
            if (er) {
              //  console.log("hi2")
              //res.send({err});
              console.log(er);
            }
          });
        }
        res.send({ msg: message });
      }
    }
  );
});

app.post("/api/getBillData", (req, res) => {
  const { UserId } = req.body;
  const sqlGetBills = "SELECT * from `bill` WHERE user_id = ?";

  db.query(sqlGetBills, [UserId], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

app.get("/api/getBillData1", (req, res) => {
  const sqlGetBills = "SELECT * from `bill` WHERE status != 'Delievered'";

  db.query(sqlGetBills, (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      res.send(result);
    }
  });
});

app.post("/api/getDetailedBill", (req, res) => {
  const { bill_Id } = req.body;
  console.log(bill_Id);
  const sqlBillDetails =
    "SELECT bill_details.food_price,bill_details.rider_gender,bill_details.quantity,bill_details.rider_number,bill_details.rider_name,bill_details.total_price,bill_details.status,food.id,food.food_name,food.cover_image,bill.grandTotal,bill.status as bstatus  FROM `bill_details` INNER JOIN bill on bill_details.bill_id = bill.bill_id INNER JOIN food ON bill_details.food_id=food.id where bill_details.bill_id= ?";

  db.query(sqlBillDetails, [bill_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/getResId", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const sqlGetResId = "SELECT r_id from admin_restaurant  WHERE adminphone = ?";

  db.query(sqlGetResId, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/getOrderDetails", (req, res) => {
  const { restaurant_Id } = req.body;
  console.log(restaurant_Id);

  const sqlgetOrdersData =
    "SELECT bill_details.food_price,bill_details.quantity,bill_details.total_price,bill_details.bill_id,bill_details.bd_id,bill_details.status_for_admin,bill_details.rider_number,bill_details.rider_name,food.food_name,food.cover_image FROM `bill_details` INNER JOIN food ON bill_details.food_id=food.id  where bill_details.r_id = ?";

  db.query(sqlgetOrdersData, [restaurant_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.get("/api/getAllOrderData", (req, res) => {
  const getAllOrderData =
    "SELECT * ,food.cover_image,food.restaurant_phone FROM `bill_details` INNER JOIN food ON bill_details.food_id=food.id";

  db.query(getAllOrderData, (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/UpdateBillDetail_StartedPreparing", (req, res) => {
  const { bd_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const UpdateBillDetail_StartedPreparing =
    "UPDATE `bill_details` SET `status`= 'Restaurant Started Preparing your Food' , `status_for_admin`= 'Preparing' WHERE `bd_id` = ?";

  db.query(UpdateBillDetail_StartedPreparing, [bd_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      res.send(result);
      console.log("result is ", result);
    }
  });
});

app.post("/api/UpdateBill_StartedPreparing", (req, res) => {
  const { bill_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const UpdateBillDetail_StartedPreparing =
    "UPDATE `bill` SET `status`= 'Restaurants Started Preparing your Food' WHERE `bill_id` = ?";

  db.query(UpdateBillDetail_StartedPreparing, [bill_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      res.send(result);
      console.log("result is ", result);
    }
  });
});

app.post("/api/UpdateBillDetail_Prepared", (req, res) => {
  const { bd_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const UpdateBillDetail_Prepared =
    "UPDATE `bill_details` SET `status`= 'Restaurant Prepared this Food' , `status_for_admin`= 'Prepared' WHERE `bd_id` = ?";

  db.query(UpdateBillDetail_Prepared, [bd_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      res.send(result);
      console.log("result is ", result);
    }
  });
});

app.post("/api/UpdateBill_Prepared", (req, res) => {
  const { bill_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const UpdateBill_Prepared =
    "UPDATE `bill` SET `status`= 'Restaurants Prepared Your Food' WHERE `bill_id` = ?";

  db.query(UpdateBill_Prepared, [bill_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      res.send(result);
      console.log("result is ", result);
    }
  });
});

app.post("/api/UpdateBillDetail_OutForDelievery", (req, res) => {
  const { bd_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const UpdateBillDetail_OutForDelievery =
    "UPDATE `bill_details` SET `status`= 'Out For Delievery' , `status_for_admin`= 'Out For Delievery' WHERE `bd_id` = ?";

  db.query(UpdateBillDetail_OutForDelievery, [bd_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      res.send(result);
      console.log("result is ", result);
    }
  });
});

app.post("/api/checkAllAreOutForDelieveryOrNot", (req, res) => {
  const { bill_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const CheckCountOfItems =
    "SELECT COUNT(bd_id) as cnt1 FROM `bill_details` WHERE bill_id = ?";

  db.query(CheckCountOfItems, [bill_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("error is ", error.code);
    }

    if (result) {
      console.log(result);
      let count1 = result[0].cnt1;

      const CheckCountOfDelievered =
        "SELECT COUNT(bd_id) as cnt2 FROM `bill_details` WHERE bill_id = ? AND status_for_admin = 'Out For Delievery'";

      db.query(CheckCountOfDelievered, [bill_id], (err, result2) => {
        if (err) {
          res.send(err.code);
          console.log("errpr is ", err.code);
        }
        if (result2) {
          console.log(result);
          let count2 = result2[0].cnt2;

          console.log("count1 is : " + count1);
          console.log("count2 is : " + count2);

          if (count1 === count2) {
            const UpdateMainStatus =
              "UPDATE `bill` SET `status`= 'Out For Delievery' WHERE `bill_id` = ?";

            db.query(UpdateMainStatus, [bill_id], (er, result3) => {
              if (err) {
                res.send(err.code);
                console.log("errpr is ", err.code);
              }
              if (result3) {
                res.send({ msg: "Whole Order Out For Delievery" });
              }
            });
          } else {
          }
        }
      });
    }
  });
});

app.post("/api/CancelOrder", (req, res) => {
  const { bill_id } = req.body;

  console.log("reached here!! here body is " + req.body);
  const CancelOrderFromBillTable =
    "UPDATE `bill` SET `status`= 'Cancelled' WHERE `bill_id` = ?";

  db.query(CancelOrderFromBillTable, [bill_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
    }

    if (result) {
      const CancelOrderFromBillDetailsTable =
        "UPDATE `bill_details` SET status = 'Cancelled' , status_for_admin = 'Cancelled' WHERE bill_id = ?";
      db.query(CancelOrderFromBillDetailsTable, [bill_id], (error, result1) => {
        if (error) {
          res.send(error.code);
          console.log("errpr is ", error.code);
        }
        if (result1) {
          res.send({ msg: "Order Cancelled!!" });
        }
      });
    }
  });
});

app.get("/api/getFoodDataAdmin", (req, res) => {
  const sqlAllFood = "SELECT * from `food`";

  db.query(sqlAllFood, (err, result) => {
    res.send(result);
  });
});

app.post("/api/addRider", (req, res) => {
  const { name, address, phone, gmail, age, gender, password } = req.body;
  console.log("reached here!!");
  console.log("with body as ", req.body);
  const sqlInsertRider =
    "INSERT INTO `delieveryrider`(`Name`, `Age`, `gender`, `gmail`, `phone` , `password` , `address`) VALUES (? , ? , ? , ? , ? , ? ,?)";
  db.query(
    sqlInsertRider,
    [name, age, gender, gmail, phone, password, address],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        console.log("result of rider add", result);
        res.send({ msg: "email/phone already exiist" });
      }
    }
  );
});

app.get("/api/getRiderdata", (req, res) => {
  const sqlselRiderdata = "SELECT * from delieveryrider";

  db.query(sqlselRiderdata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getBilldata", (req, res) => {
  const sqlselBilldata =
    "SELECT * from bill WHERE status = 'Restaurants Started Preparing your Food' ";

  db.query(sqlselBilldata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getBilldata2", (req, res) => {
  const sqlselBilldata2 =
    "SELECT * from bill WHERE status = 'Informed Restaurant About Your Order' ";

  db.query(sqlselBilldata2, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getRiderAccToStatus", (req, res) => {
  const getRiderAccToStatus =
    "SELECT * from delieveryrider WHERE status = 'Active' ";

  db.query(getRiderAccToStatus, (err, result) => {
    res.send(result);
  });
});

app.post("/api/delieveryRiderAlotted", (req, res) => {
  const { bill_id, id, name, phone, gender } = req.body;
  console.log("reached here!!");
  console.log("with body as ", req.body);
  const sqlUpdateBillWithRider =
    "UPDATE `bill` SET `rider_id`= ? , `rider_name` = ? , `rider_mobile` = ? , `rider_gender` = ? WHERE `bill_id` = ?";
  db.query(
    sqlUpdateBillWithRider,
    [id, name, phone, gender, bill_id],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        const UpdateSameInDetailsTable =
          "UPDATE `bill_details` SET rider_number = ? , rider_name = ? , rider_gender = ? WHERE bill_id = ?";
        db.query(
          UpdateSameInDetailsTable,
          [phone, name, gender, bill_id],
          (error, result1) => {
            if (error) {
              res.send(error.code);
              console.log("errpr is ", error.code);
            }
            if (result1) {
              const UpdateRiderStatus =
                "UPDATE `delieveryrider` SET status = 'Attending Delievery'  WHERE Rider_id = ?";
              db.query(UpdateRiderStatus, [id], (error, result1) => {
                if (error) {
                  res.send(error.code);
                  console.log("errpr is ", error.code);
                }
                if (result1) {
                  res.send({ msg: "Not Abled to Update" });
                }
              });
            }
          }
        );
      }
    }
  );
});

app.post("/api/getpaymentPendingDataDelievered", (req, res) => {
  const { restaurant_Id } = req.body;
  console.log(restaurant_Id);

  const sqlgetOrdersData =
    "SELECT bill_details.food_price,bill_details.bd_id,bill_details.quantity,bill_details.total_price,bill_details.bill_id,bill_details.status_for_admin,bill_details.rider_number,bill_details.rider_name,bill_details.payment_received,bill_details.r_id,food.food_name,food.cover_image FROM `bill_details` INNER JOIN food ON bill_details.food_id=food.id  where bill_details.r_id = ? AND bill_details.payment_received = 'No' AND bill_details.status_for_admin = 'Delievered'";

  db.query(sqlgetOrdersData, [restaurant_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/getpaymentReceievedData", (req, res) => {
  const { restaurant_Id } = req.body;
  console.log(restaurant_Id);

  const sqlgetOrdersData =
    "SELECT bill_details.food_price,bill_details.quantity,bill_details.total_price,bill_details.bill_id,bill_details.status_for_admin,bill_details.rider_number,bill_details.rider_name,bill_details.payment_received,bill_details.r_id,food.food_name,food.cover_image FROM `bill_details` INNER JOIN food ON bill_details.food_id=food.id  where bill_details.r_id = ? AND bill_details.payment_received = 'Yes' AND bill_details.status_for_admin = 'Delievered'";

  db.query(sqlgetOrdersData, [restaurant_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/getAlottedOrderData", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const sqlAlottedDelievery =
    "SELECT * from bill WHERE rider_mobile = ? AND status != 'Delievered'";

  db.query(sqlAlottedDelievery, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log("i am here and here the result is :", result);
      if (result.length === 0) {
        const PyaentGievnToRestaurantCheck =
          "SELECT * from bill WHERE rider_mobile = ? AND status = 'Delievered' AND paid_to_restaurant = 'No'";

        db.query(PyaentGievnToRestaurantCheck, [phone], (error, result2) => {
          if (error) {
            console.log(error);
            res.send(error);
          }
          if (result2) {
            if (result2.length === 0) {
            } else {
              res.send(result2);
            }
          }
        });
      } else {
        res.send(result);
      }
    }
  });
});

app.post("/api/getDetailedBill2", (req, res) => {
  const { bill_Id } = req.body;
  console.log(bill_Id);
  const sqlBillDetails2 =
    "SELECT bill_details.food_price,bill_details.rider_gender,bill_details.quantity,bill_details.rider_number,bill_details.rider_name,bill_details.total_price,bill_details.payment_received,bill_details.r_id,bill_details.status_for_admin,food.food_name,food.cover_image,admin_restaurant.resname,admin_restaurant.resaddress FROM `bill_details` INNER JOIN bill on bill_details.bill_id = bill.bill_id INNER JOIN food ON bill_details.food_id=food.id INNER JOIN admin_restaurant on bill_details.r_id = admin_restaurant.r_id where bill_details.bill_id= ?";

  db.query(sqlBillDetails2, [bill_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/OrderDelievered", (req, res) => {
  const { bill_Id, phone, rname, paymentReceived } = req.body;

  var { DL_today } = req.body;
  const dl = DL_today + 1;
  console.log("reached here!! dl+today is ", DL_today);

  const sqlUpdateBillWithDelieveredOrder =
    "UPDATE `bill` SET `status`= 'Delievered' , `received_By` = ? WHERE `bill_id` = ?";
  db.query(
    sqlUpdateBillWithDelieveredOrder,
    [rname, bill_Id],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        const UpdateSameInDetailsTableAsDelievered =
          "UPDATE `bill_details` SET `status`= 'Delievered' , status_for_admin = 'Delievered' WHERE bill_id = ?";
        db.query(
          UpdateSameInDetailsTableAsDelievered,
          [bill_Id],
          (error, result1) => {
            if (error) {
              res.send(error.code);
              console.log("errpr is ", error.code);
            }
            if (result1) {
              if (paymentReceived === "Yes") {
                const UpdateRiderStatus =
                  "UPDATE `delieveryrider` SET status = 'Deactive' , DL_Today = ?  WHERE phone = ?";
                db.query(UpdateRiderStatus, [dl, phone], (error, result2) => {
                  if (error) {
                    res.send(error.code);
                    console.log("errpr is ", error.code);
                  }
                  if (result2) {
                    res.send({ msg: "Not Abled to Update" });
                  }
                });
              }
              if (paymentReceived === "No") {
                const UpdateRiderStatus =
                  "UPDATE `delieveryrider` SET status = 'Giving Payments to Restaurants'  WHERE phone = ?";
                db.query(UpdateRiderStatus, [phone], (error, result2) => {
                  if (error) {
                    res.send(error.code);
                    console.log("errpr is ", error.code);
                  }
                  if (result2) {
                    res.send({ msg: "Not Abled to Update" });
                  }
                });
              } else {
              }
            }
          }
        );
      }
    }
  );
});

app.post("/api/getRiderStatus", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const getRiderStatus =
    "SELECT status , DL_Today from delieveryrider WHERE phone = ? ";

  db.query(getRiderStatus, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/updatePaymentstatus", (req, res) => {
  const { bd_id } = req.body;
  console.log("reached here!!");
  console.log("with body as ", req.body);
  const sqlUpdateBillDetailsPaymentReceived =
    "UPDATE `bill_details` SET `payment_received`= 'Yes' WHERE `bd_id` = ?";
  db.query(sqlUpdateBillDetailsPaymentReceived, [bd_id], (error, result) => {
    console.log(error);
    if (error) {
      res.send({ error });
    }

    if (result) {
      res.send(result);
    }
  });
});

app.post("/api/checkAllArePaidOrNot", (req, res) => {
  const { bill_id, rider_number } = req.body;

  console.log("reached here!! here body is " + req.body);
  const CheckCountOfItems =
    "SELECT COUNT(bd_id) as cnt1 FROM `bill_details` WHERE bill_id = ?";

  db.query(CheckCountOfItems, [bill_id], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("error is ", error.code);
    }

    if (result) {
      console.log(result);
      let count1 = result[0].cnt1;

      const CheckCountOfDelievered =
        "SELECT COUNT(bd_id) as cnt2 FROM `bill_details` WHERE bill_id = ? AND payment_received = 'Yes'";

      db.query(CheckCountOfDelievered, [bill_id], (err, result2) => {
        if (err) {
          res.send(err.code);
          console.log("errpr is ", err.code);
        }
        if (result2) {
          console.log(result);
          let count2 = result2[0].cnt2;

          console.log("count1 is : " + count1);
          console.log("count2 is : " + count2);

          if (count1 === count2) {
            const UpdateMainBillStatus =
              "UPDATE `bill` SET `paid_to_restaurant`= 'Yes' WHERE `bill_id` = ?";

            db.query(UpdateMainBillStatus, [bill_id], (er, result3) => {
              if (er) {
                res.send(err.code);
                console.log("errpr is ", err.code);
              }
              if (result3) {
                console.log(result3);
                console.log(result3.affectedRows);
                console.log("rider number is : ", rider_number);
                if (result3.affectedRows === 1) {
                  console.log("rider number is : ", rider_number);
                  const selectNoOfdels =
                    "SELECT * from delieveryrider WHERE `phone` = ?";

                  db.query(selectNoOfdels, [rider_number], (er, result4) => {
                    if (er) {
                      res.send(err.code);
                      console.log("errpr is ", err.code);
                    }
                    if (result4) {
                      var totalDel = result4[0].DL_Today;
                      const delNo = totalDel + 1;

                      console.log("result4 is : ", result4);

                      console.log("result4 total del no is  : ", totalDel);
                      console.log("result4 del no is  : ", delNo);
                      const UpdateRiderStatus =
                        "UPDATE `delieveryrider` SET `status`= 'Deactive' , DL_Today = ? WHERE `phone` = ?";

                      db.query(
                        UpdateRiderStatus,
                        [delNo, rider_number],
                        (er, result5) => {
                          if (er) {
                            res.send(err.code);
                            console.log("errpr is ", err.code);
                          }
                          if (result5) {
                            res.send({ msg: "Whole Order's Payment Received" });
                          }
                        }
                      );
                    }
                  });
                } else {
                }
              }
            });
          } else {
          }
        }
      });
    }
  });
});

app.post("/api/UpdateStatusToactive", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const UpdateStatusToactive =
    "UPDATE `delieveryrider` SET `status`= 'Active' WHERE `phone` = ?";

  db.query(UpdateStatusToactive, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

//UpdateStatusToactive
//allOrdersDelieevredByRider

app.post("/api/allOrdersDelieevredByRider", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const sqlAlottedDelievery =
    "SELECT * from bill WHERE rider_mobile = ? AND status = 'Delievered'";

  db.query(sqlAlottedDelievery, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log("i am here and here the result is :", result);
      if (result.length === 0) {
        const PyaentGievnToRestaurantCheck =
          "SELECT * from bill WHERE rider_mobile = ? AND status = 'Delievered' AND paid_to_restaurant = 'Yes'";

        db.query(PyaentGievnToRestaurantCheck, [phone], (error, result2) => {
          if (error) {
            console.log(error);
            res.send(error);
          }
          if (result2) {
            if (result2.length === 0) {
            } else {
              res.send(result2);
            }
          }
        });
      } else {
        res.send(result);
      }
    }
  });
});

app.post("/api/addRiderReview", (req, res) => {
  const { bill_Id, riderNumber, message, uname, userNumber } = req.body;

  const sqlRiderReviewInsert =
    "INSERT INTO `rider_review`(`bill_id`, `rider_number`, `review`, `user_number`, `user_name`) VALUES (? , ? , ? , ? , ?)";
  db.query(
    sqlRiderReviewInsert,
    [bill_Id, riderNumber, message, userNumber, uname],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        res.send({ msg: "Thanks For Your Review 😊" });
      }
    }
  );
});

app.post("/api/addFoodReview", (req, res) => {
  const { food_id, message, uname, userNumber } = req.body;

  const sqlFoodReviewInsert =
    "INSERT INTO `food_review` (`food_id`, `message`, `username`, `userPhone`) VALUES (? , ? , ? , ? )";
  db.query(
    sqlFoodReviewInsert,
    [food_id, message, uname, userNumber],
    (error, result) => {
      console.log(error);
      if (error) {
        res.send({ error });
      }

      if (result) {
        res.send({ msg: "Thanks For Your Review 😊" });
      }
    }
  );
});

app.post("/api/checkRiderIsReviewed", (req, res) => {
  const { bill_Id } = req.body;
  console.log(bill_Id);
  const checkRiderIsReviewed =
    "SELECT * from `rider_review` Where `bill_id` = ?";

  db.query(checkRiderIsReviewed, [bill_Id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/foodDataWithId", (req, res) => {
  const { id } = req.body;
  console.log(id);
  const sqlfoodDataWithId = "SELECT * from `food` Where `id` = ?";

  db.query(sqlfoodDataWithId, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/foodReviewWithId", (req, res) => {
  const { id } = req.body;
  console.log(id);
  const sqlfoodreviewWithId = "SELECT * from `food_review` Where `food_id` = ?";

  db.query(sqlfoodreviewWithId, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/RiderReviewOfNumber", (req, res) => {
  const { phone } = req.body;
  console.log(phone);
  const sqlRiderReviewOfNumber =
    "SELECT * from `rider_review` Where `rider_number` = ?";

  db.query(sqlRiderReviewOfNumber, [phone], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/RegisterQuery", (req, res) => {
  const { username, phone, query } = req.body;
  console.log(phone);
  const sqlRegisterQuery =
    "INSERT INTO `customers_queries`(`user_phone`, `user_name`, `query`) VALUES (? , ? , ?)";

  db.query(sqlRegisterQuery, [phone, username, query], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/RegisterAdminQuery", (req, res) => {
  const { name, phone, query } = req.body;
  console.log(phone);
  const sqlRegisterQuery =
    "INSERT INTO `admin_queries`(`admin_phone`, `admin_name`, `query`) VALUES (? , ? , ?)";

  db.query(sqlRegisterQuery, [phone, name, query], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.get("/api/getResCount", (req, res) => {
  const sqlgetResCount = "SELECT COUNT(r_id) as rescount from admin_restaurant";

  db.query(sqlgetResCount, (err, result) => {
    res.send(result);
  });
});
app.get("/api/getCustomerCount", (req, res) => {
  const sqlgetCustomerCount = "SELECT COUNT(user_id) as custcount from users";

  db.query(sqlgetCustomerCount, (err, result) => {
    res.send(result);
  });
});
app.get("/api/getOrdersCount", (req, res) => {
  const sqlgetOrdersCount = "SELECT COUNT(bill_id) as ordercount from bill";

  db.query(sqlgetOrdersCount, (err, result) => {
    res.send(result);
  });
});

app.post("/api/getpendingOrdersRes", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const getpendingOrdersRes =
    "SELECT COUNT(bd_id) as pendingOrders FROM `bill_details` WHERE status_for_admin = 'Pending' AND r_id = ?";

  db.query(getpendingOrdersRes, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/totalItemsRes", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const totalItemsRes =
    "SELECT COUNT(id) as totalitemsRes FROM `food` WHERE r_id = ?";

  db.query(totalItemsRes, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/totalEarningRes", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const totalEarningRes =
    "SELECT SUM(profitt) as totalprofit FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes' AND r_id = ?";

  db.query(totalEarningRes, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/totalSoldRes", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const totalSoldRes =
    "SELECT SUM(quantity) as soldItems FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes' AND r_id = ?";

  db.query(totalSoldRes, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/TotalVegItems", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const TotalVegItems =
    "SELECT COUNT(id) as totalveg FROM `food` WHERE category = 'Veg' AND r_id = ?";

  db.query(TotalVegItems, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/TotalOrderDelieveredRes", (req, res) => {
  const { r_id } = req.body;
  console.log(r_id);
  const TotalOrderDelievered =
    "SELECT COUNT(bd_id) as totaldel FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes' AND r_id = ?";

  db.query(TotalOrderDelievered, [r_id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

//EditRestaurant

app.post("/api/EditRestaurant", (req, res) => {
  let { resname, resaddress, reslandmark, rescity, r_id } = req.body;

  console.log(req.body);
  console.log(req.files);

  let UpdateRestaurant = "";
  if (req.files !== null) {
    let resphoto = req.files.resphoto;
    let resPhotoPath = `public/images/res_images/${resphoto.name}`;
    let resPhotoPathDB = `res_images/${resphoto.name}`;

    resphoto.mv(resPhotoPath, (e) => {
      if (e) {
        console.log(e);
      }
    });

    UpdateRestaurant += `UPDATE admin_restaurant SET resphoto="${resPhotoPathDB}",resname="${resname}",resaddress="${resaddress}",reslandmark="${reslandmark}",rescity="${rescity}" WHERE r_id=${r_id}`;
  } else {
    UpdateRestaurant += `UPDATE admin_restaurant SET resname="${resname}",resaddress="${resaddress}",reslandmark="${reslandmark}",rescity="${rescity}" WHERE r_id=${r_id}`;
  }

  db.query(UpdateRestaurant, (error, result) => {
    console.log(error);
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      res.send({
        message: "Something wrong Happened!! Try again after some time",
      });
    }
  });
});

app.post("/api/EditFood", (req, res) => {
  let {
    food_name,
    food_description,
    actual_price,
    selling_price,
    discount,
    profit,
    category,
    subcategory,
    main_price_for_profit,
    discount_to_be_shown,
    total_discount_for_customer,
    id,
  } = req.body;

  console.log(req.body);
  console.log(req.files);

  let UpdateFood = "";
  if (req.files !== null) {
    let cover_image = req.files.cover_image;
    let cover_imagePath = `public/images/food_image/${cover_image.name}`;
    let cover_imagePathDB = `food_image/${cover_image.name}`;

    cover_image.mv(cover_imagePath, (e) => {
      if (e) {
        console.log(e);
        return res.send("Error in file upload");
      }
    });

    UpdateFood += `UPDATE food SET food_name="${food_name}",food_description="${food_description}", cover_image="${cover_imagePathDB}" ,actual_price="${actual_price}",category="${category}" , subcategory="${subcategory}", price="${selling_price}", discount="${discount}", profit="${profit}", main_price_for_profit="${main_price_for_profit}", discount_to_be_shown="${discount_to_be_shown}", total_discount_for_customer="${total_discount_for_customer}" WHERE id=${id}`;
  } else {
    UpdateFood += `UPDATE food SET food_name="${food_name}",food_description="${food_description}",actual_price="${actual_price}",category="${category}" , subcategory="${subcategory}", price="${selling_price}", discount="${discount}", profit="${profit}", main_price_for_profit="${main_price_for_profit}", discount_to_be_shown="${discount_to_be_shown}", total_discount_for_customer="${total_discount_for_customer}" WHERE id=${id}`;
  }

  db.query(UpdateFood, (error, result) => {
    console.log(error);
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      res.send({
        message: "Something wrong Happened!! Try again after some time",
      });
    }
  });
});

app.post("/api/blockfood", (req, res) => {
  const { id } = req.body;
  console.log("reached here in blocked food where id is ", id);
  console.log(id);
  const updatefoodblocked =
    "UPDATE `food` SET `status`= 'blocked' WHERE `id` = ?";

  db.query(updatefoodblocked, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/showfood", (req, res) => {
  const { id } = req.body;
  console.log(id);
  const updatefoodshow = "UPDATE `food` SET `status`= 'show' WHERE `id` = ?";

  db.query(updatefoodshow, [id], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/getadmindata", (req, res) => {
  const { AdminId } = req.body;
  console.log(AdminId);
  const getadmindata = "SELECT * from `admin` WHERE `id` = ?";

  db.query(getadmindata, [AdminId], (error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    if (result) {
      console.log(result);
      res.send(result);
    }
  });
});

app.post("/api/UpdateAdmin", (req, res) => {
  const { AdminId, full_name, email, phone, gender, oldnumber } = req.body;

  console.log("reached here!! here body is " + req.body);
  const sqlUpdateAdmin =
    "UPDATE `admin` SET `full_name`= ? , `email`= ? , `phone`= ? , `gender`= ? WHERE `id` = ?";

  db.query(
    sqlUpdateAdmin,
    [full_name, email, phone, gender, AdminId],
    (error, result) => {
      if (error) {
        res.send(error.code);
        console.log("errpr is ", error.code);
      }

      if (result) {
        if (result.affectedRows === 1) {
          const sqlUpdateAdmin2 =
            "UPDATE `admin_queries` SET `admin_phone`= ?  WHERE `admin_phone` = ?";

          db.query(sqlUpdateAdmin2, [phone, oldnumber], (error2, result2) => {
            if (error2) {
              res.send(error2.code);
              console.log("errpr is ", error2.code);
              console.log("errpr is ", error2);
            }

            if (result2) {
              if (result2.affectedRows === 1) {
                const sqlUpdateAdmin3 =
                  "UPDATE `admin_restaurant` SET `adminphone`= ?  WHERE `adminphone` = ?";

                db.query(
                  sqlUpdateAdmin3,
                  [phone, oldnumber],
                  (error3, result3) => {
                    if (error3) {
                      res.send(error3.code);
                      console.log("errpr is ", error3.code);
                      console.log("errpr is ", error3);
                    }
                    if (result3) {
                      if (result3.affectedRows === 1) {
                        const sqlUpdateAdmin4 =
                          "UPDATE `food` SET `restaurant_phone`= ?  WHERE `restaurant_phone` = ?";
                        db.query(
                          sqlUpdateAdmin4,
                          [phone, oldnumber],
                          (error4, result4) => {
                            if (error4) {
                              res.send(error4.code);
                              console.log("errpr is ", error4.code);
                              console.log("errpr is ", error4);
                            }
                            if (result4) {
                              if (result3.affectedRows > 0) {
                                res.send(result);
                              }
                              if (result3.affectedRows === 0) {
                                res.send(result);
                              }
                            }
                          }
                        );
                      }
                      if (result3.affectedRows === 0) {
                        const sqlUpdateAdmin4 =
                          "UPDATE `food` SET `restaurant_phone`= ?  WHERE `restaurant_phone` = ?";
                        db.query(
                          sqlUpdateAdmin4,
                          [phone, oldnumber],
                          (error4, result4) => {
                            if (error4) {
                              res.send(error4.code);
                              console.log("errpr is ", error4.code);
                              console.log("errpr is ", error4);
                            }
                            if (result4) {
                              if (result3.affectedRows > 0) {
                                res.send(result);
                              }
                              if (result3.affectedRows === 0) {
                                res.send(result);
                              }
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }

              if (result2.affectedRows === 0) {
                console.log(
                  "im here raghav mago is about to update his restaurant numbrer also"
                );
                const sqlUpdateAdmin3 =
                  "UPDATE `admin_restaurant` SET `adminphone`= ?  WHERE `adminphone` = ?";

                db.query(
                  sqlUpdateAdmin3,
                  [phone, oldnumber],
                  (error3, result3) => {
                    if (error3) {
                      res.send(error3.code);
                      console.log("errpr is ", error3.code);
                      console.log("errpr is ", error3);
                    }
                    if (result3) {
                      if (result3.affectedRows === 1) {
                        console.log(
                          "im here when raghva updated the resturant phone"
                        );
                        const sqlUpdateAdmin4 =
                          "UPDATE `food` SET `restaurant_phone`= ?  WHERE `restaurant_phone` = ?";
                        db.query(
                          sqlUpdateAdmin4,
                          [phone, oldnumber],
                          (error4, result4) => {
                            if (error4) {
                              res.send(error4.code);
                              console.log("errpr is ", error4.code);
                              console.log("errpr is ", error4);
                            }
                            if (result4) {
                              if (result4.affectedRows > 0) {
                                console.log(
                                  "im here when raghva updated the food phone"
                                );
                                res.send(result);
                              }
                              if (result3.affectedRows === 0) {
                                res.send(result);
                              }
                            }
                          }
                        );
                      }
                      if (result3.affectedRows === 0) {
                        const sqlUpdateAdmin4 =
                          "UPDATE `food` SET `restaurant_phone`= ?  WHERE `restaurant_phone` = ?";
                        db.query(
                          sqlUpdateAdmin4,
                          [phone, oldnumber],
                          (error4, result4) => {
                            if (error4) {
                              res.send(error4.code);
                              console.log("errpr is ", error4.code);
                              console.log("errpr is ", error4);
                            }
                            if (result4) {
                              if (result4.affectedRows > 0) {
                                res.send(result);
                              }
                              if (result3.affectedRows === 0) {
                                res.send(result);
                              }
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }
          });
        }
      }
    }
  );
});

app.post("/api/UpdateAdmin2", (req, res) => {
  const { AdminId, full_name, email, phone, gender } = req.body;

  console.log("reached here!! here body is " + req.body);
  const sqlUpdateAdmin =
    "UPDATE `admin_queries` SET `admin_phone`= ?  WHERE `admin_phone` = ?";

  db.query(sqlUpdateAdmin, [phone, phone], (error, result) => {
    if (error) {
      res.send(error.code);
      console.log("errpr is ", error.code);
      console.log("errpr is ", error);
    }

    if (result) {
      console.log("im here in adminupdate 2 ", result);
      res.send(result);
    }
  });
});



app.get("/api/getpendingOrders", (req, res) => {
  const sqlgetpendingOrders = "SELECT COUNT(bd_id) as pendingOrders FROM `bill_details` WHERE status_for_admin = 'Pending' ";

  db.query(sqlgetpendingOrders, (err, result) => {
    res.send(result);
  });
});


app.get("/api/totalItems", (req, res) => {
  const sqtotalItemsRes = "SELECT COUNT(id) as totalitems FROM `food`";

  db.query(sqtotalItemsRes, (err, result) => {
    res.send(result);
  });
});

app.get("/api/totalEarning", (req, res) => {
  const sqtototalEarning = "SELECT SUM(profitt) as totalprofit FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes'";

  db.query(sqtototalEarning, (err, result) => {
    res.send(result);
  });
});

app.get("/api/totalSold", (req, res) => {
  const sqtototalSold = "SELECT SUM(quantity) as soldItems FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes'";

  db.query(sqtototalSold, (err, result) => {
    res.send(result);
  });
});

app.get("/api/TotalVegItems", (req, res) => {
  const sqTotalVegItems = "SELECT COUNT(id) as totalveg FROM `food` WHERE category = 'Veg'";

  db.query(sqTotalVegItems, (err, result) => {
    res.send(result);
  });
});

app.get("/api/TotalNonVegItems", (req, res) => {
  const sqTotalNonVegItems = "SELECT COUNT(id) as totalnonveg FROM `food` WHERE category = 'Nonveg'";

  db.query(sqTotalNonVegItems, (err, result) => {
    res.send(result);
  });
});

app.get("/api/TotalOrderDelievered", (req, res) => {
  const sqTotalOrderDelievered = "SELECT COUNT(bd_id) as totaldel FROM `bill_details` WHERE status = 'Delievered' AND payment_received = 'Yes'";

  db.query(sqTotalOrderDelievered, (err, result) => {
    res.send(result);
  });
});

app.get("/api/totalriders", (req, res) => {
  const sqtotalriders = "SELECT COUNT(Rider_id) as totaldelrider FROM `delieveryrider`";

  db.query(sqtotalriders, (err, result) => {
    res.send(result);
  });
});

app.get("/api/totalcustomers", (req, res) => {
  const sqtotalcustomers = "SELECT COUNT(user_id) as totalcust FROM `users`";

  db.query(sqtotalcustomers, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getquerydata", (req, res) => {
  const sqlgetadminquerydata = "SELECT * from admin_queries";

  db.query(sqlgetadminquerydata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getquerydata2", (req, res) => {
  const sqlgetCustomerquerydata = "SELECT * from customers_queries";

  db.query(sqlgetCustomerquerydata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getRiderdata", (req, res) => {
  const sqlgetRiderdata = "SELECT * from delieveryrider";

  db.query(sqlgetRiderdata, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getFooddata", (req, res) => {
  const sqlgetFooddata = "SELECT * from food";

  db.query(sqlgetFooddata, (err, result) => {
    res.send(result);
  });
});

app.post("/api/addWorkRequest", (req, res) => {
  
  const {
   typeofwork,
				email,
				PhoneNumber
  } = req.body;

 
    const sqlInsertWorkRequest =
      "INSERT INTO `workrequest`(`email`, `phone`, `typeofwork`) VALUES (?,?,?)";
    db.query(
      sqlInsertWorkRequest,
      [
        email,
				PhoneNumber,
        typeofwork
      ],
      (error, result) => {
        console.log(error);
        if (error) {
          res.send(error);
        }
        if (result) {
          res.send(result);
        } else {
          res.send({
            message: "Something wrong Happened!! Try again after some time",
          });
        }
      }
    );
  
  //console.log(`profit is ${profit}`);
});

app.get("/api/getjobdata", (req, res) => {
  const sqgetjobdata = "SELECT * FROM `workrequest`";

  db.query(sqgetjobdata, (err, result) => {
    res.send(result);
  });
});


app.get("/", (req, res) => {
  res.send("hello server");
});

app.listen(5000, () => {
  console.log("server is running at rot number " + 5000);
});
