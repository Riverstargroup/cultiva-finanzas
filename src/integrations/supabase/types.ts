export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          xp_reward?: number
        }
        Relationships: []
      }
      challenge_templates: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: number
          duration_days: number
          emoji: string
          id: string
          is_active: boolean
          reward_coins: number
          target_domain: string | null
          target_mastery_delta: number
          title: string
          verification_hint: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: number
          duration_days?: number
          emoji?: string
          id?: string
          is_active?: boolean
          reward_coins?: number
          target_domain?: string | null
          target_mastery_delta?: number
          title: string
          verification_hint?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: number
          duration_days?: number
          emoji?: string
          id?: string
          is_active?: boolean
          reward_coins?: number
          target_domain?: string | null
          target_mastery_delta?: number
          title?: string
          verification_hint?: string | null
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          created_at: string | null
          delta: number
          id: string
          reason: string
          ref_id: string | null
          ref_kind: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delta: number
          id?: string
          reason: string
          ref_id?: string | null
          ref_kind?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delta?: number
          id?: string
          reason?: string
          ref_id?: string | null
          ref_kind?: string | null
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          level: string | null
          slug: string
          sort_order: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          slug: string
          sort_order?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          level?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      dragdrop_exercises: {
        Row: {
          buckets: Json
          created_at: string | null
          id: string
          is_published: boolean
          items: Json
          skill_id: string
          time_limit_seconds: number | null
          title: string
        }
        Insert: {
          buckets?: Json
          created_at?: string | null
          id?: string
          is_published?: boolean
          items?: Json
          skill_id: string
          time_limit_seconds?: number | null
          title: string
        }
        Update: {
          buckets?: Json
          created_at?: string | null
          id?: string
          is_published?: boolean
          items?: Json
          skill_id?: string
          time_limit_seconds?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dragdrop_exercises_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back: string
          created_at: string | null
          difficulty: number
          domain: string
          front: string
          id: string
          is_published: boolean
          skill_id: string
        }
        Insert: {
          back: string
          created_at?: string | null
          difficulty?: number
          domain: string
          front: string
          id?: string
          is_published?: boolean
          skill_id: string
        }
        Update: {
          back?: string
          created_at?: string | null
          difficulty?: number
          domain?: string
          front?: string
          id?: string
          is_published?: boolean
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_events: {
        Row: {
          created_at: string | null
          event_kind: string
          id: string
          metadata: Json | null
          plot_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_kind: string
          id?: string
          metadata?: Json | null
          plot_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_kind?: string
          id?: string
          metadata?: Json | null
          plot_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "garden_events_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "user_garden_plots"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: Json | null
          content_type: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          module_id: string
          order: number
          slug: string
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          content?: Json | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          module_id: string
          order?: number
          slug: string
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          content?: Json | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          module_id?: string
          order?: number
          slug?: string
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      minigames: {
        Row: {
          created_at: string | null
          difficulty: number
          id: string
          is_published: boolean
          kind: string
          payload: Json
          skill_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          difficulty?: number
          id?: string
          is_published?: boolean
          kind: string
          payload?: Json
          skill_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          difficulty?: number
          id?: string
          is_published?: boolean
          kind?: string
          payload?: Json
          skill_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "minigames_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_published: boolean
          order: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          order?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          order?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      plant_shop_items: {
        Row: {
          created_at: string | null
          description: string
          emoji: string
          id: string
          is_available: boolean
          is_cosmetic: boolean
          name: string
          power_description: string | null
          price: number
          slug: string
          sort_order: number
          special_power: string | null
          species: string
        }
        Insert: {
          created_at?: string | null
          description: string
          emoji: string
          id?: string
          is_available?: boolean
          is_cosmetic?: boolean
          name: string
          power_description?: string | null
          price: number
          slug: string
          sort_order?: number
          special_power?: string | null
          species: string
        }
        Update: {
          created_at?: string | null
          description?: string
          emoji?: string
          id?: string
          is_available?: boolean
          is_cosmetic?: boolean
          name?: string
          power_description?: string | null
          price?: number
          slug?: string
          sort_order?: number
          special_power?: string | null
          species?: string
        }
        Relationships: []
      }
      plant_species: {
        Row: {
          created_at: string | null
          display_name: string
          domain: string
          id: string
          slug: string
          sort_order: number
          stage_assets: Json
        }
        Insert: {
          created_at?: string | null
          display_name: string
          domain: string
          id?: string
          slug: string
          sort_order?: number
          stage_assets?: Json
        }
        Update: {
          created_at?: string | null
          display_name?: string
          domain?: string
          id?: string
          slug?: string
          sort_order?: number
          stage_assets?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_active_at: string | null
          level: number
          role: string
          streak_days: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_active_at?: string | null
          level?: number
          role?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          level?: number
          role?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          coaching: string
          course_id: string
          created_at: string | null
          id: string
          mission: string | null
          options: Json
          order_index: number | null
          prompt: string
          recall: Json
          tags: string[] | null
          title: string
        }
        Insert: {
          coaching: string
          course_id: string
          created_at?: string | null
          id?: string
          mission?: string | null
          options?: Json
          order_index?: number | null
          prompt: string
          recall?: Json
          tags?: string[] | null
          title: string
        }
        Update: {
          coaching?: string
          course_id?: string
          created_at?: string | null
          id?: string
          mission?: string | null
          options?: Json
          order_index?: number | null
          prompt?: string
          recall?: Json
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_results: {
        Row: {
          choices: Json | null
          completed_at: string
          id: string
          outcome: string | null
          score: number
          simulation_id: string
          user_id: string
        }
        Insert: {
          choices?: Json | null
          completed_at?: string
          id?: string
          outcome?: string | null
          score?: number
          simulation_id: string
          user_id: string
        }
        Update: {
          choices?: Json | null
          completed_at?: string
          id?: string
          outcome?: string | null
          score?: number
          simulation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_results_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulation_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          id: string
          is_published: boolean
          module_id: string | null
          scenario: Json
          slug: string
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          is_published?: boolean
          module_id?: string | null
          scenario?: Json
          slug: string
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          is_published?: boolean
          module_id?: string | null
          scenario?: Json
          slug?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "simulations_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          description: string | null
          domain: string
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string | null
          domain: string
          icon?: string | null
          id: string
          sort_order?: number
          title: string
        }
        Update: {
          description?: string | null
          domain?: string
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_attempts: {
        Row: {
          activity_id: string | null
          activity_kind: string
          created_at: string | null
          duration_ms: number | null
          id: string
          payload: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_kind: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          payload?: Json | null
          score?: number | null
          user_id?: string
        }
        Update: {
          activity_id?: string | null
          activity_kind?: string
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          payload?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_days: {
        Row: {
          created_at: string | null
          day: string
          id: string
          minutes: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day: string
          id?: string
          minutes?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          day?: string
          id?: string
          minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          completed_scenarios: string[] | null
          course_id: string
          id: string
          mastery_score: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_scenarios?: string[] | null
          course_id: string
          id?: string
          mastery_score?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          completed_scenarios?: string[] | null
          course_id?: string
          id?: string
          mastery_score?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flashcard_reviews: {
        Row: {
          due_at: string
          ease_factor: number
          flashcard_id: string
          id: string
          interval_days: number
          last_quality: number | null
          last_reviewed_at: string | null
          repetitions: number
          user_id: string
        }
        Insert: {
          due_at?: string
          ease_factor?: number
          flashcard_id: string
          id?: string
          interval_days?: number
          last_quality?: number | null
          last_reviewed_at?: string | null
          repetitions?: number
          user_id?: string
        }
        Update: {
          due_at?: string
          ease_factor?: number
          flashcard_id?: string
          id?: string
          interval_days?: number
          last_quality?: number | null
          last_reviewed_at?: string | null
          repetitions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_garden_economy: {
        Row: {
          created_at: string | null
          fire_plant_active_until: string | null
          gold_plant_active_until: string | null
          ice_plant_active_until: string | null
          last_passive_coins_at: string | null
          last_rent_collected_at: string | null
          rent_amount: number
          rent_due_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fire_plant_active_until?: string | null
          gold_plant_active_until?: string | null
          ice_plant_active_until?: string | null
          last_passive_coins_at?: string | null
          last_rent_collected_at?: string | null
          rent_amount?: number
          rent_due_at?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fire_plant_active_until?: string | null
          gold_plant_active_until?: string | null
          ice_plant_active_until?: string | null
          last_passive_coins_at?: string | null
          last_rent_collected_at?: string | null
          rent_amount?: number
          rent_due_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_garden_plots: {
        Row: {
          domain: string
          health: number
          id: string
          is_blooming: boolean
          last_watered_at: string | null
          mastery: number
          power_active_until: string | null
          special_power: string | null
          species_id: string
          stage: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          domain: string
          health?: number
          id?: string
          is_blooming?: boolean
          last_watered_at?: string | null
          mastery?: number
          power_active_until?: string | null
          special_power?: string | null
          species_id: string
          stage?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          domain?: string
          health?: number
          id?: string
          is_blooming?: boolean
          last_watered_at?: string | null
          mastery?: number
          power_active_until?: string | null
          special_power?: string | null
          species_id?: string
          stage?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_garden_plots_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "plant_species"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          done_at: string | null
          id: string
          scenario_id: string
          status: string
          user_id: string
        }
        Insert: {
          done_at?: string | null
          id?: string
          scenario_id: string
          status?: string
          user_id?: string
        }
        Update: {
          done_at?: string | null
          id?: string
          scenario_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_plant_inventory: {
        Row: {
          id: string
          is_placed: boolean
          placed_at: string | null
          pos_x: number | null
          pos_y: number | null
          purchased_at: string | null
          shop_item_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_placed?: boolean
          placed_at?: string | null
          pos_x?: number | null
          pos_y?: number | null
          purchased_at?: string | null
          shop_item_id: string
          user_id?: string
        }
        Update: {
          id?: string
          is_placed?: boolean
          placed_at?: string | null
          pos_x?: number | null
          pos_y?: number | null
          purchased_at?: string | null
          shop_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plant_inventory_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "plant_shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pollination_sessions: {
        Row: {
          coins_earned: number
          created_at: string | null
          domain_learned: string
          id: string
          insight: string
          session_date: string
          user_id: string
        }
        Insert: {
          coins_earned?: number
          created_at?: string | null
          domain_learned: string
          id?: string
          insight: string
          session_date?: string
          user_id: string
        }
        Update: {
          coins_earned?: number
          created_at?: string | null
          domain_learned?: string
          id?: string
          insight?: string
          session_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_predictions: {
        Row: {
          actual_value: number | null
          coins_earned: number | null
          created_at: string | null
          id: string
          predicted_value: number
          scenario_id: string
          user_id: string
          was_correct: boolean | null
        }
        Insert: {
          actual_value?: number | null
          coins_earned?: number | null
          created_at?: string | null
          id?: string
          predicted_value: number
          scenario_id: string
          user_id: string
          was_correct?: boolean | null
        }
        Update: {
          actual_value?: number | null
          coins_earned?: number | null
          created_at?: string | null
          id?: string
          predicted_value?: number
          scenario_id?: string
          user_id?: string
          was_correct?: boolean | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          status: string
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scenario_state: {
        Row: {
          course_id: string
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_attempt_at: string | null
          last_quality: number | null
          last_score: number | null
          next_due_at: string | null
          repetitions: number | null
          scenario_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_attempt_at?: string | null
          last_quality?: number | null
          last_score?: number | null
          next_due_at?: string | null
          repetitions?: number | null
          scenario_id: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          course_id?: string
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_attempt_at?: string | null
          last_quality?: number | null
          last_score?: number | null
          next_due_at?: string | null
          repetitions?: number | null
          scenario_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scenario_state_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scenario_state_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          id: string
          mastery: number
          skill_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          mastery?: number
          skill_id: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          mastery?: number
          skill_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_weekly_challenges: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string | null
          harvested: boolean
          id: string
          progress: number
          started_at: string | null
          status: string
          template_id: string
          user_id: string
          week_start: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          harvested?: boolean
          id?: string
          progress?: number
          started_at?: string | null
          status?: string
          template_id: string
          user_id: string
          week_start?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          harvested?: boolean
          id?: string
          progress?: number
          started_at?: string | null
          status?: string
          template_id?: string
          user_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_weekly_challenges_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "challenge_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_coin_balance: {
        Row: {
          coins: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_special_power: {
        Args: { p_inventory_id: string; p_user_id: string }
        Returns: Json
      }
      apply_flashcard_review: {
        Args: { p_flashcard_id: string; p_quality: number; p_user_id: string }
        Returns: Json
      }
      assign_weekly_challenges: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      award_coins: {
        Args: {
          p_delta: number
          p_reason: string
          p_ref_id?: string
          p_ref_kind?: string
          p_user_id: string
        }
        Returns: Json
      }
      buy_shop_item: {
        Args: { p_shop_item_id: string; p_user_id: string }
        Returns: Json
      }
      ensure_garden_economy: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string | null
          fire_plant_active_until: string | null
          gold_plant_active_until: string | null
          ice_plant_active_until: string | null
          last_passive_coins_at: string | null
          last_rent_collected_at: string | null
          rent_amount: number
          rent_due_at: string
          updated_at: string | null
          user_id: string
        }
      }
      grow_plant: {
        Args: { p_domain: string; p_mastery_delta: number; p_user_id: string }
        Returns: Json
      }
      initialize_user_garden: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      mastery_to_stage: { Args: { mastery_val: number }; Returns: string }
      place_inventory_item: {
        Args: {
          p_inventory_id: string
          p_pos_x: number
          p_pos_y: number
          p_user_id: string
        }
        Returns: Json
      }
      tick_garden_economy: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
