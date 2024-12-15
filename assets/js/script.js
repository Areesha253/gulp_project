function scrollToSection(sectionId) {
  var section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
}

$(".dot-container").on("click", function () {
  scrollToSection($(this).data("scroll-to"));
});

$("#contactForm").on("submit", function (e) {
  var firstName = $("#userfirstName").val();
  var message = $("#userMessage").val();
  var phoneNumber = $("#userPhoneNumber").val();
  
  console.log(firstName);
  console.log(message);
  console.log(phoneNumber);

  e.preventDefault();

});
