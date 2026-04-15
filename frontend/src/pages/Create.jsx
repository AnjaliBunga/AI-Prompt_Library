import { Link } from "react-router-dom";
import AddPrompt from "../components/AddPrompt";

function Create() {
  return (
    <section>
      <Link to="/library" className="back-link">
        Back to list
      </Link>
      <AddPrompt />
    </section>
  );
}

export default Create;
