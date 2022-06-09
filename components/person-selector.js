import * as React from "react";
import styled from "styled-components";

export default function PersonSelector({ bike }) {
  return (
    <Container>
      {bike ? "They have a bike" : "They don't have a bike"}
    </Container>
  );
}

const Container = styled.div`
  height: 80%;
  background: #882d60;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
`;
