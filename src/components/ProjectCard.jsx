import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({
  title,
  description,
  cover,
  role,
  industry,
  link,
  buttonText = "View Details",
  isActive = false,
  onHover = () => {},
}) {
  const isExternal = link.startsWith("http");

  const linkContent = (
    <>
      {buttonText}
      {buttonText === "Visitar" ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
    </>
  );

  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="group py-8 md:py-10 transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        {/* Miniatura visible solo en mobile, ya que no hay hover táctil */}
        <div className="md:hidden w-full h-48 rounded-2xl overflow-hidden bg-black/5">
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-display text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight transition-colors duration-300 ${
              isActive ? "text-[#385BF0]" : "text-[#1D212A]"
            }`}
          >
            {title}
          </h3>
          {(role || industry) && (
            <p className="mt-3 text-xs text-black/40 truncate">
              {[role, industry].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="shrink-0">
          {isExternal ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 border border-black/10 text-[#1D212A] transition-all duration-300 group-hover:border-[#385BF0] group-hover:text-[#385BF0]"
            >
              {linkContent}
            </a>
          ) : (
            <Link
              to={link}
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 border border-black/10 text-[#1D212A] transition-all duration-300 group-hover:border-[#385BF0] group-hover:text-[#385BF0]"
            >
              {linkContent}
            </Link>
          )}
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm text-black/50 leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  );
}
