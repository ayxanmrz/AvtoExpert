import Finder from "../Finder/Finder";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

function Home(props) {
  return <>{props.isUnderDevelopment ? <UnderDevelopment /> : <Finder />}</>;
}

export default Home;
