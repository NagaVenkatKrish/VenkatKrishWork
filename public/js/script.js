(() => {
    "use strict";

    // Bootstrap Form Validation

    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach(form => {

        form.addEventListener("submit", event => {

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");

        });

    });


    // Show / Hide Password

    const passwordButtons = document.querySelectorAll(".toggle-password");

    passwordButtons.forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(button.dataset.target);
            const icon = button.querySelector("i");

            if (!input) {
                return;
            }

            if (input.type === "password") {

                input.type = "text";

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }

                button.setAttribute("aria-label", "Hide password");

            } else {

                input.type = "password";

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }

                button.setAttribute("aria-label", "Show password");
            }

        });

    });

})();