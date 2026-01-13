export function segmentSections(text) {
  const sections = {};
  const regex = /(abstract|introduction|methodology|methods|results|discussion|conclusion|references)/gi;

  let lastIndex = 0;
  let lastSection = "unknown";

  text.split(regex).forEach((part, i, arr) => {
    if (regex.test(part)) {
      lastSection = part.toLowerCase();
      sections[lastSection] = "";
    } else {
      sections[lastSection] = (sections[lastSection] || "") + part;
    }
  });

  return sections;
}
