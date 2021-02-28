var Student = require("../models/student");

var middlewareObj = {};

// middlewareObj.checkAccountOwnership_student = function(req, res, next) {
//     if(req.isAuthenticated()){
//            Student.findById(req.params.id, function(err, foundStudent){
//               if(err){
//                 //   req.flash("error", "User not found");
//                   res.redirect("back");
//               }  else {
//                   // does user own the account?
//                if(foundStudent._id.equals(req.user._id)) {
//                    next();
//                } else {
//                 //    req.flash("error", "You don't have permission to do that");
//                    res.redirect("/explore/" + req.user._id);
//                 //    res.redirect("/home/" + req.user._id);
//                }
//               }
//            });
//        } else {
//         //    req.flash("error", "You need to be logged in to do that");
//            res.redirect("back");
//        }
//    }
//     middlewareObj.isLoggedIn = function(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     // req.flash("error", "You need to be logged in to do that");
//     res.redirect("/login");
// }

// middlewareObj.checkAccountOwnership_organisation = function(req, res, next) {
//     if(req.isAuthenticated()){
//         Organisation.findById(req.params.id, function(err, foundOrganisation){
//             if(err){
//                 // req.flash("error", "User not found");
//                 res.redirect("back");
//             }else {
//                   // does user own the account?
//                 if(foundOrganisation._id.equals(req.user._id)) {
//                    next();
//                 } else {
//                 //    req.flash("error", "You don't have permission to do that");
//                    res.redirect("/explore/" + req.user._id);
//                 //    res.redirect("/home/" + req.user._id);
//                 }
//             }
//         });
//         } else {
//             // req.flash("error", "You need to be logged in to do that");
//             res.redirect("back");
//         }
//     }
//     middlewareObj.isLoggedIn = function(req, res, next){
//         if(req.isAuthenticated()){
//             return next();
//         }
//         // req.flash("error", "You need to be logged in to do that");
//         res.redirect("/login");
//     }


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
        res.redirect("/login");
} 


// middlewareObj.isLoggedIn_organisation = function(req, res, next){
//     if(req.isAuthenticated()){
//         Organisation.findById(req.params.id, (err, foundOrganisation)=>{
//             if(err){
//                 res.redirect("/login");
//             }else{
//                 return next()
//             }
//         })
//         res.redirect("/login");
//     } 
// }

module.exports= middlewareObj;