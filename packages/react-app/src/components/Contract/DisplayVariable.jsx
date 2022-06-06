// import { Button, Flex, Box } from "@chakra-ui/react";
// import React, { useCallback, useEffect, useState } from "react";

// import { tryToDisplay } from "./utils";

// const DisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh, blockExplorer }) => {
//   const [variable, setVariable] = useState("");

//   const refresh = useCallback(async () => {
//     try {
//       const funcResponse = await contractFunction();
//       setVariable(funcResponse);
//       triggerRefresh(false);
//     } catch (e) {
//       console.log(e);
//     }
//   }, [setVariable, contractFunction, triggerRefresh]);

//   useEffect(() => {
//     refresh();
//   }, [refresh, refreshRequired, contractFunction]);

//   return (
//     <div>
//       <Box>
//         <Flex
//           span={8}
//           style={{
//             textAlign: "right",
//             opacity: 0.333,
//             paddingRight: 6,
//             fontSize: 24,
//           }}
//         >
//           {functionInfo.name}
//         </Flex>
//         <Flex>
//           <h2>{tryToDisplay(variable, false, blockExplorer)}</h2>
//         </Flex>
//         <Flex>
//           <h2>
//             <Button type="link" onClick={refresh} icon="🔄" />
//           </h2>
//         </Flex>
//       </Box>
      
//     </div>
//   );
// };

// export default DisplayVariable;
