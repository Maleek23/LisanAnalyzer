import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">LISAN</h3>
            <p className="text-sm text-primary-foreground/80">
              Linguistic Truth Engine
            </p>
            <p className="text-xs text-primary-foreground/60 font-crimson leading-relaxed">
              Restoring dignity to sacred text through rigorous linguistic analysis
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="/#features" className="hover:text-primary-foreground transition-colors" data-testid="link-features">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-primary-foreground transition-colors" data-testid="link-how-it-works">How It Works</a></li>
              <li><a href="/word/ضرب" className="hover:text-primary-foreground transition-colors" data-testid="link-demo">Try Demo</a></li>
              <li><span className="text-primary-foreground/50" data-testid="text-pricing">Pricing (Coming Soon)</span></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><span className="text-primary-foreground/50" data-testid="text-scholars">Scholars</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-contributors">Contributors</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-discord">Discord</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-forum">Forum</span></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><span className="text-primary-foreground/50" data-testid="text-api-docs">API Docs</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-blog">Blog</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-research">Research Papers</span></li>
              <li><span className="text-primary-foreground/50" data-testid="text-github-footer">GitHub</span></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-primary-foreground/70 text-center md:text-left">
            <p className="font-crimson italic mb-2">
              Made with reverence for revelation
            </p>
            <p className="text-xs">
              © 2025 Lisan • Open-source core • Scholar-verified content
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="GitHub"
              data-testid="link-github-social"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Twitter"
              data-testid="link-twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="mailto:contact@lisan.app" 
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Email"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
