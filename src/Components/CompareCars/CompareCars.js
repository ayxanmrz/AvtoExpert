import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

function CompareCars(props) {
  return <>{props.isUnderDevelopment && <UnderDevelopment />}</>;
}

export default CompareCars;
