/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor") as HTMLElement;
  const parsedText = document.getElementById("parsedText") as HTMLElement;
  const plainText = document.getElementById("html") as HTMLElement;
  const formatButton = document.getElementById("format");

  const cleanElement = (element: Element) => {
    Array.from(element.querySelectorAll("*")).forEach((e) => {
      e.removeAttribute("class");
      e.removeAttribute("style");
      if (!e.textContent?.trim()) {
        e.remove();
      }
    });
  };

  const condenseWhiteSpace = (html: string) => {
    return html.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  };

  const parseText = (element: Element) => {
    const listItems: string[] = [];
    const output: string[] = [];
    for (const p of element.querySelectorAll("p")) {
      const firstSpan = p.querySelector("span")?.textContent?.trim() || "";
      if (firstSpan === "·") {
        listItems.push(p.textContent?.replace("·", "").trim() || "");
      } else {
        if (listItems.length) {
          output.push(
            "<ul>",
            ...listItems.map((item) => `<li>${item}</li>`),
            "</ul>",
          );
          listItems.length = 0;
        }
        output.push(p.outerHTML);
      }
    }
    if (listItems.length) {
      output.push(
        "<ul>",
        ...listItems.map((item) => `<li>${item}</li>`),
        "</ul>",
      );
    }
    return output;
  };

  const addLineBreaks = (arr: string[]) => {
    let output = '';
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      output += item;
      
      if (i === arr.length - 1) {
        break; // Don't add anything after the last item
      }
  
      const nextItem = arr[i + 1];
      if (
        !nextItem.startsWith('<li>') &&
        !nextItem.startsWith('<ul>') &&
        !nextItem.startsWith('</ul>') &&
        !item.endsWith('</ul>')
      ) {
        output += '<br>';
      }
    }
    return output;
  };
  
  

  formatButton?.addEventListener("click", () => {
    const innerHtmlOfTd = editor.querySelector("td")?.innerHTML ?? null;

    if (innerHtmlOfTd !== null) {
      let temporaryElement = document.createElement("div");
      temporaryElement.innerHTML = innerHtmlOfTd;

      cleanElement(temporaryElement);
      temporaryElement.innerHTML = condenseWhiteSpace(
        temporaryElement.innerHTML,
      );

      const output = parseText(temporaryElement);
      parsedText.innerHTML = addLineBreaks(output);
      parsedText.innerHTML = parsedText.innerHTML.replace(
        /<\/?span[^>]*>/g,
        "",
      );

      plainText.textContent = parsedText.innerHTML;
      console.log(parsedText.innerHTML);
    }
  });
});
