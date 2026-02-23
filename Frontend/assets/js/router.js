
export function setActiveNav(routeKey) {
  const links = document.querySelectorAll(".app-nav-link");
  links.forEach((link) => {
    const linkRoute = link.getAttribute("data-route");
    if (linkRoute === routeKey) {
      link.classList.add("app-nav-link--active");
    } else {
      link.classList.remove("app-nav-link--active");
    }
  });
}

export function navigateTo(routeKey) {
  window.location.hash = `#${routeKey}`;
}
