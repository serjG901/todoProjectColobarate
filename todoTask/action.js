let checked = document.getElementById("checked");

checked.addEventListener("change", () => {
    checked.getAttribute("checked")
        ? (checked.removeAttribute("checked"),
          (checked.parentNode.parentNode.style.textDecoration = "none"))
        : (checked.setAttribute("checked", true),
          (checked.parentNode.parentNode.style.textDecoration =
              "line-through"));
});

