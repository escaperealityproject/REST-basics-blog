var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  app = express();

//APP CONFIG

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");

app.use(express.static("public"));


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride("_method"));

//MONGOOSE CONFIG

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTES

//INDEX ROUTE

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("Error at /blogs");
    } else {
      res.render("index", {
        blogs: blogs
      });
    }
  })
})

//NEW ROUTE

app.get("/blogs/new", function(req, res) {
  res.render("new");
})

//CREATE ROUTE

app.post("/blogs", function(req, res) {
  Blog.create({
    title: req.body.title,
    image: req.body.image,
    body: req.body.body
  }, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  })
});

//SHOW ROUTE

app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {
        blog: foundBlog
      });

    }
  })
});

//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {
        blog: foundBlog
      });
    }
  })
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body
  }, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  })
})

app.listen(3000, function() {
  console.log("Server is running");
  setInterval(function() {
    console.log("Server is running");
  }, 5000);
});

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  })
})

// Blog.create({
//   title: "DOG BLOG",
//   image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhMVFhUVFRUYGBgYFxcVFRUVFRcWGBYVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0lICUrLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTctNzctNy0tLf/AABEIAKgBKwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAQIDBAYABwj/xABBEAABAwIEAwUFBgUCBQUAAAABAAIDBBEFEiExQVFhBhMicYEykaGx8CNCUsHR4QcVYnLxFDMkgpKy0hZDU3Oi/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAKBEAAgICAgEDBAIDAAAAAAAAAAECEQMhEjFBBCIyExRRYULRcZGh/9oADAMBAAIRAxEAPwC21ic5q5pSvKko5ieomlPBQA9ODUwJ4KAI3MTg1c4pWlAChqUNXBKEAI4JganuK5iAFyJMqeuKQxmVIWpxSEoA4NTS1PBSFAiBzEwsUzimkoAhyLi1SriEAVyF1k5yYXIAa4KMtUhcoygBtkhCemoGMLUwtUpTUxEZamFqmKjcgCFzVLhgtImOUmG+2kB6BhjvCikZQnDdkVhQBMkslSIA89BTZZEhaqtVdMCxFJdWGlD6UFXmtKAJAU8JgCUoAjlelY5QSN1U0bUATtKXMkASEIAa+RdG9QytTYboAvXXEpjQnWQA1zlEXp72qB7dUAWWuXOKZEE4tSAieVG5yke1RiFzjZoJPTVACNepHFG8P7HyuALiG3Oo4gJavstO1xa0Bw4OvYeqVodGbkKiJWtg7GvP+5I1vQC/oitN2QpmjxhzyTxNvklzQ+LPOi5OC9Q/kdKAB3LbDz+PNTTYNTvAzRN09PklzQ+B5QSmEr1GXsrSO07vL/aSL+aCYl2E0Jgf5NcfzVKSZLRhnPTWvVrF8KmgdlkaRyPA+SHRA32KoRbKicpcuiheEARuUmGe2oXKbCz40gN/hvsorChWHeyikKAJ0iVIgDAFttCLHqoZo16NU4XG8eJoWfr+zZGsfuVUFgDDKbM5amDDBYaKlhtD3Z8QsjzJglyQ+L7BsmFDkqFRhfJaPNdJkuqpEdGV/lJTXYc4LXZByTTA0pUOzGup3jgoybbrZuomlUarCQeCKCzMuF0xrEbOCngFPT9nHE6pUOwI1SNjJ2BWupuzzRuERiwlg4I4iswraGQ/dUjcEkK3zaJo4KGrnjj31J2AQ6W2NW9IyUeAuG5TxhMY9p3uRCurr7+7gEK/1LnOsFx5PUeInXD0/mRY/wBHCNGszHqr1G0N1Aa0dBb4qiZAxrnE7C5PRYDFe3MjpO7ZcC9hYfBYKcpM2+nFHq7sWaDlB1U0MpdufroszgGHFje8lJL3Wvc8+C0LCQPrVUm/JDjHwXGvGtk0lxJVTvr6jgben18k6CchtjqRc/oq5E8SxIeF9fq6t5whEc/j9D5qxJJ5fvx+aFMHjstvfZKyoF1WkkuFBFIjn+A+na2E5I2SCzmtcOougFf2VjveMb8OSnnxARglxsrdJWhzQb3vt+i0h6jdGcsDqzPVHZotG11RlwUclue8uOd1UqYmnhYrdZY+TJ434PN6/BbaoXRwlsi9BxCHQ6LFVYtMFq6a0Z7XZrsNPhRSFCcM9lFIipGWUiQFddABCx/CUoZ0Kja5g27z4pwlbzf7itSCGopg7QhA63D3sN26jktIxzf6ilDeYKynijI0hllEzdJWcDur8UoKkr8Ka7Vtw5CpYJIzYgnqFztTxs6E8eRBYtSAKjT1ttCiFNUtKuOdPsiWBrokjiJV2Kk5qaAtKsBdCaOdpohbTAKURgJyVMBLLrJbpEAV66bu2OfyCx4qS5znuNytH2md9gf7m3WOpj4T1N1weqk+VHd6aK42MqJyTYKeibyVRrddt/r0V18oijLzwGnV2wC5KOpsAdt8VDI+5Ydd3n5BCP4bYGJHuqXi4YbNHAnmUOx5pkkDXOAc8k5bguseJF/3Xp2CYe2npmRjgLk9Trqt4rijKbvRZE+qWesIIaOe6jp5mG9vfz5obWT/AGp8gf8AKh6GlsNS1GVvmNB+aipqjw3O3ta7qi92e44NBP7fC6bE/QEdfgeSTGki7A68nlb9kQc+45fX7qrQUbgLnc66/BWJIyOF0JaBtWOgdpb0T2N1VSN+qvxC6EKRnO1lOTG61wSNCOawuGdq5YjkJBsdQTr7ivVsRpg5pBFwvA+32H91VaXDXi/S43Wn0lIUZ+D3/A6ts0Qkafa19VM/fX6Cyv8ACqW9La97ba81o5XnPZQpe1E8fe6IKl4a6ztjshWIdno5SHsdlcOG4Kv4wLtvfZB8LxQklp4c/wBUo5ZRejR4lOOy5SwOZ4XbhXGOU4lDxrY9VC+IjbZdmPMpHFkwyiStcnZktPFzVjuguhIwsnzPHtSt9yUTc5PcFWiIcfs4SRzdoPipQH/eLGAcrErQkm70X9p3uSiUH7zlBFUA6RgvP4jo33p8kgaPtHgdG7oAkztJ0uU90JtqAq8Uzz/tx2HN2nwTrXPjeXHkNAhoCCrw1jtePRVf5YW7O96JmU/0tHXUqCol4OII/EOCzlii+0aRyyXRTDJGHmrseIEbphqA3R+oOxUMwB32Ox5LJ4XH4s0WVS+SCkGJNKttmBWMmmMbtTccD+qX+cjmsl6iUdSRp9upbibS64uWWjxwgbqrU4453G3RW/VRoj7aVmgxxzXwvZcXI08xqFhKSTQtvr9f4V6SrLtbodMbPDhs7foVy5MnN2dePHwVBCmh4qh2rmyxMjF7udew3PII0XBrLnQAfJB8PZ/qZhOf9uM2Zf7x5+SzXZZm+zGCudVl8rMobdxuOWw1+fRafH8Vtu5rRw0JNuvBqu9oJyyNz2/dGvDTzXiOK1pMYqHVMrp5HuOUG0TIbeDzcTe44WXTDG5nPOaieu4VV5wCPZsdeZVCsqSZbA7ob2Pq/wDhRzd4t9geAVqRpzZllKNaNYyvYbpqj7J3Lr6WIUWETZ5L8G6efNRHSADXx/IDT4hNwE5c1+J+I/z8ENdBfZrnV1tOI09U6hxNjnFhPiG4/dZyuksc2awO+vy6oNHWB0n2cjgRfVoLhodb80bFSPRnUYPiZ7k6EHYodhFc5oBeQ5p+82+hP4mnVq0L4w4X+iqUE9ozc2tMpztuF5b/ABEw8Sgg6FuoJHHoV6lKdCCsB2yZfXdF0XBD/wCETvsHDlutm8eLrw8+Syf8M2Wjf5/nutXI7xe9Zf2W+wfWu8Duo26LENc5krgeO3X153+a12ITfEnjvf5eSyleBn47n4/NZs3iabCKu4I+HkijpsuqzuGPuL7G/wAeJV+aouAHb8+aExNBqCoab8xw3VkOQGicQQ8bjS/5HotFCx7gDbfouzBmdUzh9RiSdorsxWJw/wBwi/NpHyTw2I3yyD3ZvmqdRLI2weGNHBgAc79fgkdI9uvdAf3HN8CbBejSOGy7FJ90TDyaxSR0gvmzOJ/sWVqe3DobgRhxB+63T1cNFFD/ABNa/wALqWY8zG7j56WQ0ws20l/xkebVVLpG+w5h9Nfgh+G9pWSHIO9ifwEpD2n/AJrmx9Veqp9w9mV1tHtvvwPkkMhNfIDZ8QI5hIZGPBsco4tKHHHxG7JOchOz7eA/3D8wrck7T7bLHgRq1w5gjcIAhBMfhN3MPHiE3Nk1aczOXJPmfkBym45H8lj8Vryy7onacWlIZpKmZjgQ06HgsxVMcx/tXHxCzk+NvLrsJa7iOCvQVDnWc86rl9QlX7OrA3f6NFHNcJe9F9Ah0E4sp45Vx0dll0v1U7YSd+YVFr+JV+lmGXM7QDiUgIcflLgynYfFIbX5NG58kWp2BjWtbs0WQnC4y9z6h1/F4WdG8T0uiTroQmNxin7ynlZzb5rxp2CvDcrXFrwbG7Q5hH3Xtdmu13AttbS4Opt7gwjKgtXhcZeCWiw1PU8AuiGXgjCWPkwPhmHd3GwXPst9AB8FedATlHEkfFEW0+Y3+CvUNBc3OwO/S52WSuTNXUUDMRjaMrR91p8uh+KHROyiwPEn32/dFa+IlxceJ0/K/ToqAp98wuDulJ0xxjaMn2oxN75GxNNgDa9/vHQD3rDVveh7rufmY/K4AuaG8rBvBbbtRh/iaGFzXA52usSG5bcOOt7pskkEwD5YpY5wNXw5XtkPDO0/MruxcaOTLytlrsz2pNO2Id5JLDKCyRkrT3sLgN2O/wDdjNuOoXrPZrFxJE2xvcc78dF5H2U7LzS1TZn5skejA6wIv94gaX8ua9Zw/B2RNa1gtbl13WObu4lY17akE6w6XWB7US3NgPyW8qhZmqweLNLnkfuspG2Ms9gbh7geLfktLUusbjr8P8oH2bi7uVp5tP5ItWPs619/gR9BZtUX5sBYpJqRwOovz+vigUlzpx1P7Izibbi/VvoTa/ohBNnX629OYWbRunoJUujdPPXmR/lcavMW73/Lb68lAZQND18xwv5Kvht3yWHI2872IRQmzW4JB3rwBsLZuR2+fLgti3TSyHYPh7YYw0+0dSeZV/Oei9P0+LhHfZ5efJzlroCz4hDHfI0Odxd++5WPxrtM1zsgD5DexbGLgX5qzTUExfmjD3X0s45m29dk6k7NVMc7qmbKWNOZrIRme4/hI4AdN12aicvZk5sbbHLaWF72nWxhkZYcPFq0qXHcf7uO8MLY2u1aSRe/9gR92G4jd2WVrGuJIba7mgnRtwNwguJdk3uJMhdK88GAlx83HVJv8sa/Ri349VyvD2vIDTcEizb8gBuF672G7VuqYHd40F8Vs4GoLeY6dPNeWVXY+uneAyIsDRZrM4aeuYc1qewHZKrw+o7+dzWRuaWujLs2e/lpcIBG4xijhlheRZzOI4sPMcWrG0eKSUTgx95adx0vq5nl+i11THSAkipa1wFy0OvYdRvb9UMpuyL3tflljlicSWjUFoOuUHj0UFE2ITd40GIXBFw4bELL4rSnd2h+aJ0GBYhAXtib3kRPB7c7DzLHEH3bofjtJUBpMty38QBsPPTRJ6KRk6qmbnBvqEQjeh7omB2ZpufO6ma5cmbbOvDpBeKWysMmQVsyv0zzyXM0dCYVgOYrQUUbba69EEw2IX1WhiADUUJsRzhwTwwkXVBs2puikBu26ErE9EQd4T5qIsvv9eaexwufr0UsbLnr8EuLYXQ2niBIAv8AXVE5NGZR6+d1HEMoIFr7/np7wp6UEjMfl8l0Qx0jGWS2D6mC+tiqcMIvzHLl79wtO2IOF7fuqM1JY3t+RCxyY6NseS9GYxXD7ubbhqL+75JlJgcV8xbudbAWHWy0VVD6cjyKoglhyuBHUcfJRGXEqSsK0ULWNAaNB9bIpTNPFDqNxO49UWaLNutYPkzHJrRUxJ3hIWUZS5n36o3W1Fyo6OHW6b2wjpEU0IZkf+FwH/Xp9eijrZL3v9H6AU1fVg3jvuPjw+SHMNyM24tcfC6xm1ejeC1spVocW3Hp1PL1GqFVhAJ+rHfT3o/NGQMv1z1QHFWG5IH1+qhGgPnqySbctPTZbzsLhGVgnfvrbrfis52X7PGZ/ePB7sf/AK6BehjYNHhA24aLqwYuT5Po5M+WlxXZbdJ7kmVV2QngbpC9/wCD4rvOEqVPaKNosxpcf+lv6oXJiUsps9xa08BoLfMqTPTRPsBmcNy7W3v0QSXGBLUG2oboLDZaql0Z7LWL4pFFaOPNnPG50HFAcZ7YSwtEUIALjbPbW/IX3KbieHTSygsOTmXXvbkP1Vqq7HPfle7KS0aW4X4jqpZSA8eLzQkNacz3auebkNH6qOStlkl7ySUlrdGtJvc/iNtB5dFoqTsi1+hlcHcrJf8A0gxjrSh7hzB/RS7bK0AqRsLXukJJc/2ibajlbgNFaw/EX0j+8pZLxk+KFx8IJ4s8+S0buw0JGaMk/wBJN/oq3B2IpJGEFpa+24cQQULQWGBW2Y2pynVviYBcny5oJB2zp+8ILXMB9trhf4K3hGH1LYzE2UHJ7OcXIHQpKqnLw9tVSRSvYCcwIBI4WO6uNeSHfghZS4bO9zTHCWu9k5Qwg8bO0KG1H8P4JMwhkdG9vC/eRu5HXUe9U8BnpnRulkp3xsF9GXcRbW+m6t4FjEDnGSkEr2A5TnGQ3O9gbG3VE8WNhDJNGdk7IVTTo1jtbe2AQR+IOsrtF2RqCbOkhb/z3+A/VauLtLG92SOAtc25PeBttNwOZ4pa7FA8hggawuaD3lwNL65QNVzfbRvZ0fcSKsPZjuW55J2ZeY0v5XO6qOxmkBLHf6l1vwRHX1tZMxzCpGDMNQ07jU5TsQTt1Wj7PuEkIGUAgZXae0Od0/owSuhPLJvsFYNhTKgOIa+PldwLumZvLyTqt3dnIdCNPPyV2jaaabLuD/2koti1JE4ZpG5mkjzaeDmnglkwJ/EcM7XZlJ62KEAPtmOoHnufyVuDF4gLXBceC8+/iHhdbBUOqi0ywOIyyMBLWNG0crBq3j4tjusvDjZLw5vG2x06W6KY4+KKeSz2yDFWbG3mioxCP2Ta+mnHVeQ4ZXOIvceV7X9VscIxeM2zOs7bmQN0bQ9M1xmA0adkrXX+vzQ6srhbKDrzVcYiW2GpJ+HUrlyT2bwhoJVDA4Fp0+uCHMv7Dxmbw5D1VllSDa53+avQwaLKuTNb4or0UGXa/kUbjbduqq08HEqN1c9ry3KMvAg6+oXTjhx7ObJLl0UZKHxHouqniKMuPoOZRRovqVmO2Ve1jQCbKnClYKVugbnubndNdN4geQ18hsVSw+ta4Xvsh7cSBqHMuRoCuHizs5I1TXZrHmLHiOiczDA867DfqP1QeKuyg2sfXTzVuLHd3OIaGi9r7W4qo47Yp5KWg06vdAQxugA0Ftgi9HUF44IJJVsqYiWZS5rbgjfn6hVcOxgNaLnb3ELqgnF9nLOpK6NbFG25zDKRrp9apf5vCNDLHcc3AH1CH02KiQC1iAR4uA9VFUdn6WVxkfA0udqTzO35LqjNeTmljfgymH4a6SQiVxFzqButCcCZTtzRDXc9V2K0uSRrxxOqOk3iueS2b6aMUU6CNkzfEBdRxDupcpNwdlF2dk1Pqlx99nsIRXuoPFl3F6Tw943Qt105KegIlj1Usbs0fmEOwF1nuaeBKXaG+yXC25JCwqzktUacRf3Jj2/aOkPstHyTsOLnF0ztL7DkAj9gcyUmoIbsB4lMHjvyLfcF1WwF1855lJSPJmlB0F/U+SdCKeB4cwNkjIFsxtttqEI7M4V3E8kZb4SSP0NkQqG9zU59mu66WPBXsTomvtK32mgajiN07/6KjO9oaLuajO0HKSHf+QUuMMHdB9vY4/0u+gi3aaiNRCHxu8Tfc4HcW5qnhLTJDkePE0ZHDgRwNkr6Y0ttDsJr2zRZSL5RY3104XVXs9M6OodG525LfzHks/hUrqaqMT72d4fMfdKO1EJbUtk4OA1/qbw9yK91fkfgMdp4Bla+5FjY/krdLI2eAC+4t5EbH5JmLxh8Tmn7zbt8xr+Sz3ZCYlz4uod+qS+P+A8hbAcQDs0T7Wsb325EHzWA7a/wubmdPhvtDxOguMpvreJ33Xb+E6eSJ4/VSCpkgpr2B8bgPvnUtDtgAj3Y+J8VzM7frcjmXFVJLsUW+jxfDcRyl7ZWlrgCx7CLPB2tlOxCO9m6ENdmF7nxam5ueZ6CwXo/aDszS4hIXtAZMG+GZoFzbYP/ABNusqMHqYSe8gf4RZzmNztsNA421+HFc+SLRvjkg9e4BTmR/hHiGlzsfVVMPs4aWAcNuXXVEobE2HsuFnDcWXG4bOvlosR5SBe41vfT6srdZi0FPHmmkDRYkD7zrbhoO52VSonbE3PKRkZfXQ5jwAG9ysZi9XLM/vy1jow0ZQ0fax2vq0n2reh35o1EXyNYMV7/AE7wsGpAAsOme+pKsQl0RHejM07PtdpvwJ+6fNZXDahpcDfQXdbcEgWI14WJWtpq9rDkJBaQLX8QLSL2+OycU5bYS1pBsM8JyHhoDw8l5x2nwCtqXkMA0OlydfcLWW2jm7tvhuWE+EjUt4lv6e5RuqmZwQ67XWvlJFieY4LoW9GDVHnFD2PxKME5Y/LPf8lncYwevgkdM6LQgC7Te1uq9xcZRIC37SIDUXD3E9dNApYhnc7JlOmrHj5C2ir6MSPqyPmtnaqYZ43aOsRyI5FCO+kLtXFxcd7k3+K+m5+ytFODmpYS5puWvjabHkDa4CdB2coY2CWKkgYQdQI28N+CpY66JeS+zwyp7QyUTGiJ+V5ZY2I473Qum7TVDrWlAsCAByPTiV9JTUdIxzD3MFpNxkZy0dsqsmH0JkMZp4XMAzXETfC7k1wb8imoCeQwvZzEHMpoonMPePcCQ0XJB1vbktpTiUNAz26ctdlJG5jGutT5XgnI6zc1uFyDf0Un85n/APiCagHNsbjz9WDqrs7/ALH0QTH5/tWjkib5bxDyVv4ohdsE9m5/HZXe0uzT1Qjsy/7Q+ZRPtDM05W31uql8xL4hrCXXjCGRT5ZXAbl1lXpcXyNDLXJVGukc2Zl9zr7ynBbYpOqNbjBDYT6fldLQSh8VhysoMRdmhP8Ab+Sg7OS3YQo/iV5FwWYMc6M78FHiWeOXvBsfmqVc+1ULHki2OvHck3taxVPtP8i8D5qZs0eY7gXHQp+DPuyx4FRdnpw6PdQ4O+0zxfTX5lTXaH5Q/DrsmczgSbKOps2q0sL2+I/ZSVr8tQ3rZUe1Undysfzy/Aprf+hAHtjCRLHK3hcH0t+61EFP3lPmP4cw8wFUxqh7yHMOBDvMcfmiGDSNbTgE2aLjU8El0n+BvuhcMe2WIsO7Vjn1f+hdPM6wyEtbm2JdqCfJHMFqHszlrS4Hb7o04m6Ddp+yhr3h073ANvla02aCeJ5nqq6bJ7SMezte0aRjMSScztBc6k23KJUtfVVItYhp5eBvmSdSpIP4cNj1jls7gXDMrTey9fs2sia3/wCtznDyubITodWajBZY6WIl7ruPHnya0IphVY57ZJfQDgDwHyWUoOxDs2eeplkPkGj05LXQQBkXdC4Ft+PmeqToEmD8YwMSSQAOLXM0LhoXN4g89j71QxOjqon93Td3IbXAkJj52aXgH5LR1TSYcvtPA0O2o43Velle2K0jPHrbiRy13UOMXtlKUl0eP4liFVLO+Kr8MsZB7vQBo5sA3aeeuyrVWI905ue5bfUc7HxW5jUH1XrE9BTykOqIGTPGz3N8TdNQHb2Qt3Y+gzCQ07XOG2YuIHk0myxlhVm0czRm8PwOVpIgBfHlaWG+mV42ueQRqpwqr7sNZGHHj4wNOB8xxWhjsLAAAAaACwA6BTtlTjiSCWVsDVVNUZGPbGQ8DI5u4I3Dt9RdTUdEI4y6VmZrn3kLjbxWGjRe4sLeeqLtnITu/vobW5cPctIxSM3KyMQRxvaacgAi5F9LeXUK2XXf3mzrW02t15qKNjDsLKcMIGmyZJwBuTfU78CVI2PTXbkq0l+qkjkTGMNPHmzZRfa/G3mpRE3mffcLu8S5kCGS0xO1lQdQH8TkWD09AGC7Qzf8SB0RoH7Mf2pVyuXSJXbMV/OxA7KzxPN7D8yrjajKC+V4zHU67dAEq5VJbFHovdkB38pedQNk/HZL1QHAWXLk/wCQPoNYtWtZCdR7NkOwbGI44yXOA9dVy5Ql7Rvsz+L9rGCXvGskfa1g1hN/LRV5+11XVkRimfHHxJacxtwSLk2woNUeI1DG2igkJ62AHUq/hFXLE4uljeSeQuNeqRclYeRJ8Rnlna7uXBgtqd7I7iIFQwNcLWPquXJNgixHB4BGToBbqU+KlY0WDRZcuUjHloHBVpBrdcuTAhlfcqxHGFy5IZYjUpK5cgCMlNzX0XLkANexQyQgrlyQFZ9MmZLLlyBjSuuuXJiHMfZXop9Fy5AE7HXSmILlyAGOZZNASrkAKb8E8PHFcuQI/9k=",
//   body: "Test BLog"
// });
//RESTFUL ROUTES
