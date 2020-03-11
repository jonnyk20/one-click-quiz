import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { isDev } from "../utils/utils";

import "./MailingListSignup.scss";

const MailingListSignup = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const history = useHistory();

  const onSubmit = (e: React.FormEvent) => {
    if (isDev) {
      e.preventDefault();
      history.push("/thank-you");
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  return (
    <div className="mailing-list-signup">
      <div id="mc_embed_signup">
        <form
          action="https://hotmail.us19.list-manage.com/subscribe/post?u=bce60b3470eb44450c176869b&amp;id=694d5cf2d9"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          target="_self"
          noValidate
          onSubmit={onSubmit}
        >
          <div
            id="mc_embed_signup_scroll"
            className="mailing-list-signup__form"
          >
            <div className="mc-field-group">
              <input
                type="email"
                value={inputValue}
                onChange={handleChange}
                name="EMAIL"
                className="required email mailing-list-signup__form__input"
                id="mce-EMAIL"
                placeholder="your@email.com"
              />
            </div>
            <div id="mce-responses" className="clear">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              ></div>
            </div>
            {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
            <div
              style={{ position: "absolute", left: "-5000px" }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_bce60b3470eb44450c176869b_694d5cf2d9"
                tabIndex={-1}
                value=""
              />
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Stay up to date"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailingListSignup;
