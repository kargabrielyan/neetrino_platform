'use client';

import Image from 'next/image';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { Project } from '@/lib/portfolio-data';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  className?: string;
}

export default function ProjectCard({ project, priority = false, className = '' }: ProjectCardProps) {
  return (
    <article className={`glass rounded-3xl overflow-hidden hover:glass-strong transition-all duration-300 group focus-within:glass-strong ${className}`}>
      {/* Project Cover */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.cover.url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          placeholder="blur"
          blurDataURL={project.cover.blurDataURL}
        />
        

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 glass-strong text-ink text-xs font-semibold rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      
      {/* Project Content */}
      <div className="p-6">
        {/* Project Meta */}
        <div className="flex items-center gap-4 text-sm text-ink/60 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{project.year}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-semibold text-ink mb-2 group-hover:text-a1 transition-colors">
          {project.title}
        </h3>
        
        {/* Project Summary */}
        <p className="text-ink/70 mb-4 leading-relaxed line-clamp-2">
          {project.summary}
        </p>
        
        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 glass-subtle text-ink text-xs rounded-full font-medium"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-1 glass-subtle text-ink/60 text-xs rounded-full">
              +{project.tech.length - 4} more
            </span>
          )}
        </div>
        
        {/* Action Button */}
        {project.liveUrl && (
          <div className="flex justify-center">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 glass-strong text-ink rounded-full font-medium hover:glass transition-all duration-200 focus-ring"
            >
              <ExternalLink className="w-4 h-4" />
              View Project
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
