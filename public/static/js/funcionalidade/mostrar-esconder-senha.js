const pwShowHide = document.querySelectorAll(".showHidePw");

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const parent = eyeIcon.parentElement;
    const input = parent.querySelector("input");

    if (input.type === "password") {
      input.type = "text"; // mostra a senha
      eyeIcon.classList.replace("uil-eye", "uil-eye-slash"); // olho fechado = senha visível
    } else {
      input.type = "password"; // esconde a senha
      eyeIcon.classList.replace("uil-eye-slash", "uil-eye"); // olho aberto = senha oculta
    }

    eyeIcon.classList.add("blink");
    setTimeout(() => eyeIcon.classList.remove("blink"), 150);
  });
});
