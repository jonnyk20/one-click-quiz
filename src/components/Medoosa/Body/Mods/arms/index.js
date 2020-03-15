import React from "react"
import Arms0 from "./arms-0"
import Arms1 from "./arms-1"
import Arms2 from "./arms-2"
import Arms3 from "./arms-3"
import Arms4 from "./arms-4"

let arms = [Arms0, Arms1, Arms2, Arms3, Arms4]
arms = arms.map(ArmsSVGComponent => () => (
  <div className="arms">
    <ArmsSVGComponent />
  </div>
))

export default arms
