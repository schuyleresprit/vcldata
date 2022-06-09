import * as React from "react";
import styled from "styled-components";

export default function TrajectoriesMap() {
  // const [nav, flipNav] = useState(false);

  return <Container>Lorem ipsum</Container>;
}

const Container = styled.div`
  height: calc(100vh - 4rem);
  background: #aa3939;
  width: 75%;
  display: flex;
  flex-flow: column nowrap;

  @media only screen and (max-width: 960px) {
    height: 100%;
    width: 100%;
  }
`;
