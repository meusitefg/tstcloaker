import { describe, expect, it, beforeEach } from "vitest";
import { addLink, normalizeUrl, registerVisit, toggleLink } from "./links";

describe("Cloakfy engine & links", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("adds https to bare domains and rejects invalid scripts", () => {
    expect(normalizeUrl("minhaoferta.com/vendas")).toBe("https://minhaoferta.com/vendas");
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
  });

  it("paused links do not redirect or count", () => {
    const l = addLink({
      name: "a",
      destination: "https://x.com/",
      source: "ig",
      medium: "",
      campaign: "",
    });
    // Force simulated human visit
    expect(registerVisit(l.id, false)).toBe("https://x.com/?utm_source=ig");
    toggleLink(l.id);
    expect(registerVisit(l.id, false)).toBeNull();
  });

  it("routes bots to safe page and humans to real offer", () => {
    const l = addLink({
      name: "Campanha Black",
      destination: "https://minhaoferta.com/vendas",
      safePage: "https://cloakfy.app/safe/bella",
      source: "facebook",
    });
    // Bot visit
    const botDestination = registerVisit(l.id, true);
    expect(botDestination).toBe("https://cloakfy.app/safe/bella");

    // Human visit
    const humanDestination = registerVisit(l.id, false);
    expect(humanDestination).toContain("minhaoferta.com/vendas");
  });
});
