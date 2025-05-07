import Link from "next/link";
import Image from "next/image";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  setLoginCredentials,
  deleteLoginCredentials,
} from "../redux/actions/flightActions";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import DeveloperNavbar from "../components/developerNavbarr";
// import XmasThemedImg from "../public/247TRAVELSXmas-logo.webp";
import Script from "next/script";

const Navbarr = () => {
  let loginCredentials = useSelector((state) => state.store.loginCredentials);

  const dispatch = useDispatch();

  const router = useRouter();

  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != "") return false;
    }
    return true;
  }

  // dispatch(deleteLoginCredentials());
  const handleLogout = () => {
    dispatch(deleteLoginCredentials());
    router.push("/");
  }

  //   console.log(loginCredentials);

  //   if (checkProperties(loginCredentials)) {
  //     console.log("working oo");
  //   }

  //   loginCredentials = isEmptyObj(obj);

  //   console.log(loginCredentials);
  let loggedInMenu;
  //   console.log(loginCredentials);
  if (checkProperties(loginCredentials) == false) {
    // console.log(loginCredentials);
    if (loginCredentials.response) {
      loggedInMenu = (
        <NavDropdown
          title={"Hello, " + loginCredentials.response.firstName}
          id="affiliate-nav-dropdown"
          className="affliate-dropdown-custom"
        >
          <NavDropdown.Item href="/affiliate-program">Profile</NavDropdown.Item>
          {/* <NavDropdown.Item href="#">Profile</NavDropdown.Item> */}
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
    // welcome nav
    if (loginCredentials.errorMessage == "Invalid username or password") {

      //destroy object
      dispatch(deleteLoginCredentials());
      //display normal nav
      loggedInMenu = (
        <>
          <NavDropdown
            title="Login/Register"
            id="basic-nav-dropdown"
            className="react-dropdown-custom"
          >
            <NavDropdown.Item href="/access-comps/login">
              Login
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/access-comps/signup">
              Sign Up
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Affiliate"
            id="affiliate-nav-dropdown"
            className="affliate-dropdown-custom"
          >
            <NavDropdown.Item href="/access-comps/affiliateLogin">
              Login
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/access-comps/signup_agency">
              Registration
            </NavDropdown.Item>
          </NavDropdown>
        </>
      );
    }
  } else {
    //nornal nav
    loggedInMenu = (
      <>
        <NavDropdown
          title="Login/Register"
          id="basic-nav-dropdown"
          className="react-dropdown-custom"
        >
          <NavDropdown.Item href="/access-comps/login">Login</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/access-comps/signup">
            Sign Up
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown
          title="Affiliate"
          id="affiliate-nav-dropdown"
          className="affliate-dropdown-custom"
        >
          <NavDropdown.Item href="/access-comps/affiliateLogin">
            Login
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/access-comps/signup_agency">
            Registration
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  }
  //   dispatch(deleteLoginCredentials());
  //   console.log(loginCredentials.response);
  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-11038833516"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-11038833516');
        `}
      </Script>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <div className="position-relative nav-brand-logo">
              <a>
                <Image
                  // src={XmasThemedImg}
                  src="/247TRAVELS-logo.webp"
                  alt={"247-Travels-Logo"}
                  width={235}
                  height={73}
                  // layout="fill"
                  objectFit="cover"
                />
              </a>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="navbar-toggle-custom"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/travel-financing">Travel Financing</Nav.Link>
              <Nav.Link href="/contact-us">Contact Us</Nav.Link>
              <Nav.Link href="https://blog.247travels.com">Blog</Nav.Link>

              {loggedInMenu}

              {/* <NavDropdown.Item href="/access-comps/signup_agency">Affiliates Portal</NavDropdown.Item>
                        </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Navbarr;
