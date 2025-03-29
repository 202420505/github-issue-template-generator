import { JSX } from "solid-js";

export default function Checkbox(props: JSX.IntrinsicElements["input"]) {
  return <input type="checkbox" {...props} />;
}
