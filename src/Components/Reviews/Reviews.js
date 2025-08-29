import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

function Reviews(props) {
  return <>{props.isUnderDevelopment && <UnderDevelopment />}</>;
}

export default Reviews;
