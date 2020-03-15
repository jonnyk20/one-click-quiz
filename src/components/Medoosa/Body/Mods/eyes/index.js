import React from "react"
import Eyes0 from "./eyes-0"
import Eyes1 from "./eyes-1"
import Eyes2 from "./eyes-2"
import Eyes3 from "./eyes-3"
import Eyes4 from "./eyes-4"
import Eyes5 from "./eyes-5"
import Eyes6 from "./eyes-6"
import Eyes7 from "./eyes-7"
import Eyes8 from "./eyes-8"
import Eyes9 from "./eyes-9"
import Eyes10 from "./eyes-10"
import Eyes11 from "./eyes-11"
import Eyes12 from "./eyes-12"
import Eyes13 from "./eyes-13"

let eyes = [
  Eyes0,
  Eyes1,
  Eyes2,
  Eyes3,
  Eyes4,
  Eyes5,
  Eyes6,
  Eyes7,
  Eyes8,
  Eyes9,
  Eyes10,
  Eyes11,
  Eyes12,
  Eyes13,
]
eyes = eyes.map(EyesSVGComponent => () => (
  <div className="eyes">
    <EyesSVGComponent />
  </div>
))

export default eyes
