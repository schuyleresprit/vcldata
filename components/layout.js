import * as React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Navbar from "../components/navbar";
import { withPrefix } from "gatsby-link";
import { GlobalStyle } from "../styles/globalStyles";

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <Helmet>
        <script src={withPrefix("scripts.js")} type="text/javascript" />
      </Helmet>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
