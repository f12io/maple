export function rule(selector: string, content: string) {
  return `:where(${selector}) { ${content} }`;
}

export function rules(selector: string, contents: Array<string>) {
  return contents.map((content) => rule(selector, content)).join(' ');
}

export function mediaRule(media: string, selector: string, content: string) {
  return `${media} { ${rule(selector, content)} }`;
}

export function mediaRules(
  media: string,
  selector: string,
  contents: Array<string>,
) {
  return contents
    .map((content) => mediaRule(media, selector, content))
    .join(' ');
}
