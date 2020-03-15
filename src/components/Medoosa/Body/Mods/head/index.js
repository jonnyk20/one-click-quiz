import React from "react"
import Head0 from "./head-0"
import Head1 from "./head-1"
import Head2 from "./head-2"
import Head3 from "./head-3"
import Head4 from "./head-4"

let head = [Head0, Head1, Head2, Head3, Head4]
head = head.map(HeadSVGComponent => () => (
  <div className="head">
    <HeadSVGComponent />
  </div>
))

export default head
