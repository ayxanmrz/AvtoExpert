import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

function Contact(props) {
  return <>{props.isUnderDevelopment && <UnderDevelopment />}</>;
}

export default Contact;
