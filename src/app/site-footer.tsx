export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border pt-6 text-[13px] text-subtle">
      &copy; {new Date().getFullYear()}
      {" "}
      Willis Allstead &middot; Reno, Nevada
    </footer>
  );
}
