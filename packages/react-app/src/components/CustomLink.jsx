import {
  Link
} from "react-router-dom";



function CustomLink({ children, to, ...props }) {
 

  return (
    <>
      <Link
        style={{ textDecoration: "none" }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </>
  );
}

export default CustomLink;
