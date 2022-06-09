import React, { useState } from "react";
import { Link } from "gatsby";
import { menuData } from "../data/menuData";
import styled from "styled-components";
import logo from "../images/itsb_icon.svg";
import { FaBars } from "react-icons/fa";

// HEADER

const Container = styled.header`
  height: 4rem;
  background: #fcb040;
  width: 100%;
  text-decoration: none;
  color: black;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled(Link)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: #000;
  text-decoration: none;
`;

const TitleText = styled.span`
  text-transform: uppercase;
`;

const TitleIcon = styled.img`
  padding: 1rem;
  height: 30px;
  width: 2rem;
`;

// MAIN MENU

const Bars = styled(FaBars)`
  color: #000;
  font-size: 1.4rem;
  display: none;
  padding: 1rem;
  cursor: pointer;

  @media only screen and (max-width: 960px) {
    display: block;
`;

const Nav = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem;
  align-items: center;

  @media only screen and (max-width: 960px) {
    display: ${({ $nav }) => ($nav ? "block" : "none")};
    background: black;
    flex-flow: column nowrap;
    position: absolute;
    top: 4rem;
    left: 0;
    width: 100%;
    height: 40%;
    padding: 3rem;
    z-index: 100;
  }
`;

const NavItem = styled.div``;

const NavLink = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem;
`;

const NavItemIcon = styled.img`
  padding-right: 0.33rem;
  display: none;

  @media only screen and (max-width: 960px) {
    padding-right: 1rem;
    display: block;
  }
`;

const NavItemText = styled.span`
  color: #000;

  @media only screen and (max-width: 960px) {
    color: #fff;
  }
`;

export default function Header() {
  const [nav, flipNav] = useState(false);

  return (
    <Container>
      <Title to="/">
        <TitleIcon src={logo} alt="Same Boats Logo" />
        <TitleText>In The Same Boats</TitleText>
      </Title>

      <Bars onClick={() => flipNav(!nav)} $nav={nav} />
      <Nav id="main-menu" $nav={nav}>
        {menuData.map((link) => (
          <NavItem key={link.name}>
            <NavLink to={link.link}>
              {" "}
              <NavItemIcon src={link.icon} alt={link.alt} />
              <NavItemText>{link.name}</NavItemText>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Container>
  );
}
