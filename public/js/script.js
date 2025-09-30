// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()



 let taxSwitch = document.getElementById("flexSwitchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("taxInfo");
    for (info of taxInfo) {
      info.classList.toggle("hidden");
    }
  });
  const scrollContainer = document.querySelector(".filters");
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  function updateArrows() {
    leftArrow.style.display = scrollContainer.scrollLeft > 0 ? "flex" : "none";
    rightArrow.style.display =
      scrollContainer.scrollLeft + scrollContainer.clientWidth <
      scrollContainer.scrollWidth
        ? "flex"
        : "none";
  }

  // Scroll on arrow click
  leftArrow.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
  });

  rightArrow.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
  });

  // Show/hide arrows on scroll
  scrollContainer.addEventListener("scroll", updateArrows);

  // Initial arrow visibility
  updateArrows();