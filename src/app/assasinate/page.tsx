import { Suspense } from "react";
import Container from "../components/Container";

export default function Assasinate() {
  return (
    <>
      <Suspense>
        <Container />
      </Suspense>
    </>
  );
}
