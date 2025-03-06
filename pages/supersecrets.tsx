import { withAuth } from "@/components/WithAuth.com";

const SuperSecrets = () => {
  return <div>I Am Super Sectret Component</div>;
};





export default withAuth(SuperSecrets);