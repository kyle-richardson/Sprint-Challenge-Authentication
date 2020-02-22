import React from "react";

import TextField from "@material-ui/core/TextField";

const SignupAdditions = ({ handleChange, passwordVerify }) => {
  return (
    <>
      <TextField
        id="outlined-password"
        name="passwordVerify"
        type="password"
        label="Verify Password"
        value={passwordVerify}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        required
      />
    </>
  );
};

export default SignupAdditions;
