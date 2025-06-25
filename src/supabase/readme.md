# 🔗 Supabase TypeScript Type Generation

This project uses **Supabase** as a backend and **TypeScript** on the frontend. To ensure full type safety, the Supabase CLI is used to generate database types based on the current schema.

---

## 📖 Why Generate Types?

Generating types directly from your Supabase schema allows you to:

-   ✅ Access your database with **type-safe autocompletion**
-   🧠 Avoid bugs due to mismatches between DB and code
-   🚀 Write cleaner and maintainable data-access logic
-   ↺ Keep frontend and backend in sync automatically

---

## 💻 Setup Instructions

### 1. Install Supabase CLI (if not already)

```bash
npm install -g supabase
```

### 2. Login via CLI

```bash
supabase login
```

This will open a browser window to authenticate your Supabase account.

---

### 3. Set your Supabase Project Reference

You can find your **project ID (ref)** in your Supabase dashboard URL:

```
https://app.supabase.com/project/<your-project-ref>
```

Set it as an environment variable:

```bash
export PROJECT_REF=your-project-ref
```

---

### 4. Generate Types (Run this!)

```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/lib/types/database.types.ts
```

This will fetch your `public` schema and write the generated types into:

```
src/lib/types/database.types.ts
```

---

## 🧪 Example Generated Code (`database.types.ts`)

```ts
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            orders: {
                Row: {
                    id: number;
                    customer_name: string;
                    created_at: string;
                };
                Insert: {
                    customer_name: string;
                };
                Update: {
                    customer_name?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}
```

> ☝️ This structure will depend on your actual schema in Supabase.

---

## 🧹 Example Usage in Code

### 1. Create typed Supabase client

```ts
// supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

export const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
);
```

### 2. Query with type safety

```ts
// inside a function or component
const { data, error } = await supabase.from("orders").select("*");

if (data) {
    data.forEach((order) => {
        console.log(order.customer_name); // ✅ string type inferred!
    });
}
```

---

## 🔁 Keeping Types Up To Date

If you change your database schema in Supabase, rerun the generation command:

```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/lib/types/database.types.ts
```

You can also generate types from multiple schemas like this:

```bash
--schema public,auth,storage
```

---

## 📂 Suggested File Structure

```
/src
  /lib
    /types
      └── database.types.ts   ← 📌 GENERATED FILE
  /services
    └── supabase.ts           ← Your typed Supabase client
```

---

## 📜 License

MIT — use freely in personal or commercial projects.

```

```
