import { useState } from "react";

const ACTIVE_TABS = {
  HTML: 0,
  CSS: 1,
  JS: 2,
};

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const getTabColor = (tab) => (activeTab === tab ? "blue" : "black");

  return (
    <div>
      <div>
        <button
          style={{
            color: getTabColor(ACTIVE_TABS.HTML),
          }}
          onClick={() => setActiveTab(ACTIVE_TABS.HTML)}
        >
          HTML
        </button>
        <button
          style={{
            color: getTabColor(ACTIVE_TABS.CSS),
          }}
          onClick={() => setActiveTab(ACTIVE_TABS.CSS)}
        >
          CSS
        </button>
        <button
          style={{
            color: getTabColor(ACTIVE_TABS.JS),
          }}
          onClick={() => setActiveTab(ACTIVE_TABS.JS)}
        >
          JavaScript
        </button>
      </div>
      <div>
        {activeTab === ACTIVE_TABS.HTML && (
          <p>
            The HyperText Markup Language or HTML is the standard markup
            language for documents designed to be displayed in a web browser.
          </p>
        )}
        {activeTab === ACTIVE_TABS.CSS && (
          <p>
            Cascading Style Sheets is a style sheet language used for describing
            the presentation of a document written in a markup language such as
            HTML or XML.
          </p>
        )}
        {activeTab === ACTIVE_TABS.JS && (
          <p>
            JavaScript, often abbreviated as JS, is a programming language that
            is one of the core technologies of the World Wide Web, alongside
            HTML and CSS.
          </p>
        )}
      </div>
    </div>
  );
}
