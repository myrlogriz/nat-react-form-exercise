import { useState, useEffect, useRef, useActionState } from "react";
import Select from "react-select";
import { COLOURS, ANIMALS } from "../constants";
import { isEmail, isNotEmpty, hasMinLength } from "../utils/validation";

const customStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "var(--input)",
    borderColor: state.isFocused ? "var(--border_focus)" : "var(--border)",
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    color: "var(--border)",
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--input)",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused
      ? "var(--input_hover)"
      : state.isSelected
      ? "var(--input_focus)"
      : "transparent",
    color: "var(--text)",
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "var(--input_focus)",
  }),
  multiValueRemove: (baseStyles) => ({
    ...baseStyles,
    marginLeft: "0.5px",
    backgroundColor: "var(--input_focus)",
    ":hover": {
      color: "var(--input_hover)",
    },
  }),
};

const CustomForm = () => {
  const [colourMessage, setColourMessage] = useState("");
  const [animalsMessage, setAnimalsMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [tigerType, setTigerType] = useState("");

  const colourSelectRef = useRef(null);
  const animalsSelectRef = useRef(null);

  const onFocusColour = ({ focused, isDisabled }) => {
    setColourMessage(
      `You are currently focused on colour option ${focused.label}`
    );
  };

  const onFocusAnimals = ({ focused, isDisabled }) => {
    setAnimalsMessage(
      `You are currently focused on animal option ${focused.label}`
    );
  };

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  const handleAnimalChange = (selectedOptions) => {
    setSelectedAnimals(selectedOptions || []);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setColourMessage("");
      setAnimalsMessage("");
    }
  }, [isMenuOpen]);

  const isTigerSelected = selectedAnimals.filter(
    (animal) => animal.label === "Tiger"
  ).length;

  function handleSubmit(_prevFormState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const tigerType = formData.get("tigerType");

    let errors = [];

    if (!isEmail(email)) {
      errors.push("Invalid email address");
    }
    if (!isNotEmpty(password) || !hasMinLength(password, 9)) {
      errors.push("You must provide a password with at least 9 characters");
    }
    if (!!isTigerSelected && !isNotEmpty(tigerType)) {
      errors.push("You must provide a tiger type");
    }

    if (errors.length > 0) {
      return { errors, enteredValues: { email, password, tigerType } };
    }

    if (colourSelectRef.current) {
      colourSelectRef.current.clearValue();
    }
    if (animalsSelectRef.current) {
      animalsSelectRef.current.clearValue();
    }

    // The form data submission can be added here
    return { errors: null };
  }

  const [formState, formAction] = useActionState(handleSubmit, {
    errors: null,
  });

  return (
    <form className="form" action={formAction}>
      <div className="form__control">
        <label htmlFor="email">Email</label>
        <span id="email-hint" className="form__hint">
          Ex. ash@gooddog.nz
        </span>
        <input
          aria-describedby="email-hint"
          id="email"
          type="email"
          name="email"
          defaultValue={formState.enteredValues?.email}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="on"
          spellCheck="false"
        />
      </div>
      <div className="form__control">
        <label htmlFor="password">Password</label>
        <span id="password-hint" className="form__hint">
          Password should be at least 9 characters long.
        </span>
        <input
          aria-describedby="password-hint"
          id="password"
          type="password"
          name="password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      <div className="form__control">
        <label htmlFor="colour">Colour (optional)</label>
        {!!colourMessage && !!isMenuOpen && (
          <span className="form__hint">{colourMessage}</span>
        )}
        <Select
          ref={colourSelectRef}
          aria-labelledby="colour"
          // While using ariaLiveMessages, I encountered a warning:
          // "Cannot update a component (`CustomForm`) while rendering a different component (`LiveRegion2`)."
          // This warning is also present in their example at https://react-select.com/advanced
          // I'll skip addressing it for now.
          ariaLiveMessages={{
            onFocus: onFocusColour,
          }}
          inputId="colour"
          name="colour"
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          options={COLOURS}
          styles={customStyles}
          placeholder="Select a colour"
        />
      </div>

      <div className="form__control">
        <label htmlFor="animals">Animals (optional)</label>
        {!!animalsMessage && !!isMenuOpen && (
          <span className="form__hint">{animalsMessage}</span>
        )}
        <Select
          ref={animalsSelectRef}
          aria-labelledby="animals"
          ariaLiveMessages={{
            onFocus: onFocusAnimals,
          }}
          inputId="animals"
          name="animals"
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          onChange={handleAnimalChange}
          options={ANIMALS}
          styles={customStyles}
          isMulti
          placeholder="Select an animal or more"
        />
      </div>

      {!!isTigerSelected && (
        <div className="form__control">
          <label htmlFor="tigerType">Type of Tiger</label>
          <input
            id="tigerType"
            type="text"
            name="tigerType"
            value={tigerType}
            onChange={(e) => setTigerType(e.target.value)}
            placeholder="Enter type of tiger"
          />
        </div>
      )}
      {/* All error messages are shown here, but depending on the AC,
      they could be rendered at the top or above/below the field to which they belong. */}
      {formState.errors && (
        <ul className="error">
          {formState.errors.map((error, index) => {
            return <li key={index}>{error}</li>;
          })}
        </ul>
      )}

      <button className="form__button">Complete</button>
    </form>
  );
};

export default CustomForm;
