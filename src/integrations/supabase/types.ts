export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      accommodations: {
        Row: {
          id: string;
          name: string;
          description: string;
          capacity: string;
          price_info: string | null;
          amenities: string[];
          images: string[];
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["accommodations"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["accommodations"]["Insert"]>;
      };
      banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string;
          cta_text: string | null;
          cta_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["banners"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["banners"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          location: string | null;
          text: string;
          stars: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["faqs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      site_config: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_config"]["Row"], "updated_at">;
        Update: Partial<Database["public"]["Tables"]["site_config"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Accommodation = Database["public"]["Tables"]["accommodations"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type FAQ = Database["public"]["Tables"]["faqs"]["Row"];
export type SiteConfig = Database["public"]["Tables"]["site_config"]["Row"];
