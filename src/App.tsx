import { createSignal, createMemo, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import PlusIcon from "lucide-solid/icons/plus";
import CopyIcon from "lucide-solid/icons/copy";
import TrashIcon from "lucide-solid/icons/trash"
import Header from "./components/Header";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Textarea from "./components/ui/Textarea";
import Select from "./components/ui/Select";
import { stringify } from "yaml";
import { Highlight } from "solid-highlight";
import "prismjs";
import "@jongwooo/prism-theme-github/themes/prism-github-default-auto.min.css";
import "prismjs/components/prism-yaml";

interface Section {
  type: "Markdown" | "Textarea" | "Input" | "Dropdown" | "Checkboxes";
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  multiple?: boolean;
  required?: boolean;
}

const App: Component = () => {
  const [store, setStore] = createStore({
    name: "",
    title: "",
    description: "",
    tag: "",
    project: "",
    assignees: "",
    sections: [{ type: "Markdown", value: "" }] as Section[],
  });

  const [copied, setCopied] = createSignal(false);

  const addSection = () => {
    setStore("sections", (sections) => [...sections, { type: "Markdown", value: "" }]);
  };

  const removeSection = (index: number) => {
    setStore("sections", (sections) => sections.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, updates: Partial<Section>) => {
    setStore("sections", index, (prev) => ({ ...prev, ...updates }));
  };

  const yamlOutput = createMemo(() => {
    const topFields: Partial<Record<keyof typeof store, string>> = {
      name: store.name,
      title: store.title,
      description: store.description,
    };

    (["tag", "project", "assignees"] as const).forEach((key) => {
      if (store[key] && store[key].trim() !== "") {
        topFields[key] = store[key] as string;
      }
    });

    const formData = store.sections
      .map((section, index) => {
        const result: any = { type: section.type.toLowerCase() };

        if (section.type !== "Markdown") {
          result.id = `${section.type.toLowerCase().replace(/ /g, "-")}-${index}`;
          result.attributes = { ...section };
          delete result.attributes.type;
        } else if (section.value) {
          result.attributes = { value: section.value };
        }

        return result;
      })
      .filter((item) => Object.keys(item.attributes || {}).length > 0);

    return stringify({ ...topFields, body: formData });
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <div class="container">
        <div class="grid md:grid-cols-2 gap-10">
          <div class="space-y-4 my-4">
            {["name", "title", "description", "tag", "project", "assignees"].map((field) => (
              <div class="space-y-1">
                <label for={`${field}-input`} class="text-sm capitalize">{field}</label>
                {field === "description" ? (
                  <Textarea
                    id={`${field}-input`}
                    placeholder={`Enter ${field}`}
                    rows={4}
                    class="w-full"
                    value={store[field as keyof typeof store] as string}
                    onInput={(e) => setStore(field as keyof typeof store, e.currentTarget.value)}
                  />
                ) : (
                  <Input
                    id={`${field}-input`}
                    placeholder={`Enter ${field}`}
                    class="w-full"
                    value={store[field as keyof typeof store] as string}
                    onInput={(e) => setStore(field as keyof typeof store, e.currentTarget.value)}
                  />
                )}
              </div>
            ))}

            <div>
              <h2 class="text-lg">Body</h2>
              <div class="space-y-2 divide-y-[1px] dark:divide-white/20">
                <For each={store.sections}>
                  {(section, index) => (
                    <div class="space-y-3 py-2">
                      <Select
                        class="block my-4"
                        value={section.type}
                        onInput={(e) => handleChange(index(), { type: e.currentTarget.value as Section["type"] })}
                      >
                        {["Markdown", "Textarea", "Input", "Dropdown", "Checkboxes"].map((type) => (
                          <option value={type}>{type}</option>
                        ))}
                      </Select>

                      <div class="space-y-2">
                        <Show when={section.type !== "Markdown"}>
                          <Input
                            class="w-full block"
                            placeholder="Enter label"
                            value={section.label || ""}
                            onInput={(e) => handleChange(index(), { label: e.currentTarget.value })}
                          />
                          <Input
                            class="w-full block"
                            placeholder="Enter description"
                            value={section.description || ""}
                            onInput={(e) => handleChange(index(), { description: e.currentTarget.value })}
                          />
                          {section.type === "Input" && (
                            <>
                              <Input
                                class="w-full block"
                                placeholder="Enter placeholder"
                                value={section.placeholder || ""}
                                onInput={(e) => handleChange(index(), { placeholder: e.currentTarget.value })}
                              />
                              <Input
                                class="w-full block"
                                placeholder="Enter value"
                                value={section.value || ""}
                                onInput={(e) => handleChange(index(), { value: e.currentTarget.value })}
                              />
                              <Input
                                type="checkbox"
                                class="w-full block"
                                checked={section.required || false}
                                onInput={(e) => handleChange(index(), { required: e.currentTarget.checked })}
                              />
                            </>
                          )}
                          {section.type === "Textarea" && (
                            <Textarea
                              rows={3}
                              class="w-full block"
                              placeholder="Enter text"
                              value={section.value || ""}
                              onInput={(e) => handleChange(index(), { value: e.currentTarget.value })}
                            />
                          )}
                          {(section.type === "Dropdown" || section.type === "Checkboxes") && (
                            <Input
                              class="w-full block"
                              placeholder="Enter options"
                              value={section.options?.join(", ") || ""}
                              onInput={(e) => handleChange(index(), { options: e.currentTarget.value.split(", ") })}
                            />
                          )}
                        </Show>

                        <Show when={section.type === "Markdown"}>
                          <Textarea
                            rows={3}
                            class="w-full block"
                            placeholder="Enter markdown content"
                            value={section.value || ""}
                            onInput={(e) => handleChange(index(), { value: e.currentTarget.value })}
                          />
                            <Input
                                type="checkbox"
                                class="w-full block"
                                checked={section.required || false}
                                onInput={(e) => handleChange(index(), { required: e.currentTarget.checked })}
                            />
                        </Show>

                        <Button
                          variety="ghost"
                          class="flex gap-1 text-red-600"
                          onClick={() => removeSection(index())}
                        >
                          <TrashIcon size={14} /> Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </For>

                <div class="flex justify-end my-6 py-4">
                  <Button
                    variety="primary"
                    class="flex gap-1 py-1.5 items-center"
                    onClick={addSection}
                  >
                    <PlusIcon size={14} />
                    Add Section
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex justify-end">
              <button
                class="px-4 py-1 flex items-center gap-2 text-sm hover:bg-black/10 dark:hover:bg-white/10 rounded transform duration-200"
                onClick={handleCopy}
              >
                {copied() ? "Copied" : "Copy"}
                <CopyIcon size={17} />
              </button>
            </div>
            <Highlight language="yaml">{yamlOutput()}</Highlight>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
