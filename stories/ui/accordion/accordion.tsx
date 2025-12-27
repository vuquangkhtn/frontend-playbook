import { PropsWithChildren, useState } from "react";
import "./styles.css";

const Accordion: React.FC<PropsWithChildren & { title: string }> = ({
  title,
  children,
}) => {
  const [collapse, setCollapse] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <div
          aria-hidden={collapse}
          onClick={() => {
            setCollapse(!collapse);
          }}
        >
          {title}
          <span
            className={collapse ? "accordion-icon" : "accordion-icon--rotated"}
          />
        </div>
      </div>
      <div
        className={
          collapse ? "accordion-body--collapse" : "accordion-body--expand"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div style={{ width: "300px" }}>
      <Accordion title="HTML">
        The HyperText Markup Language or HTML is the standard markup language
        for documents designed to be displayed in a web browser.
      </Accordion>

      <Accordion title="CSS">
        Cascading Style Sheets is a style sheet language used for describing the
        presentation of a document written in a markup language such as HTML or
        XML.
      </Accordion>

      <Accordion title="JavaScript">
        JavaScript, often abbreviated as JS, is a programming language that is
        one of the core technologies of the World Wide Web, alongside HTML and
        CSS.
      </Accordion>
    </div>
  );
}
