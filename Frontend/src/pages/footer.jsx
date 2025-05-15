import React from "react";
import { GithubIcon, LinkedinIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-12 py-6 bg-base-200 border-t border-base-300 bottom-0">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 bottom-0">
        <p className="text-sm text-base-content opacity-70">
          © {new Date().getFullYear()} Adarsh Kumar Jha. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Demonking14"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/adarsh-kumar-jha-10509327b/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            <LinkedinIcon className="size-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
