# Migration: Static Specialties to Dynamic Database Table

## Overview
Converted the hardcoded `SPECIALTIES` array in the professionals module to a dynamic database table with full CRUD operations. This change makes the system more flexible and maintainable, allowing administrators to manage specialties without code changes.

## Changes Made

### Backend Changes

#### 1. Database Migrations
- **20251116000000_create_specialties.rb**: Created `specialties` table
  - Fields: `id`, `name` (unique), `description`, `active`, timestamps
  - Indexes: unique on `name`, regular on `active`

- **20251116000001_add_specialty_id_to_professionals.rb**: Added FK to professionals
  - Added `specialty_id` foreign key to `professionals` table
  - Migrated existing data: extracted distinct specialty strings, created specialty records, linked professionals
  - Reversible migration for safe rollback

#### 2. Models
- **app/models/specialty.rb**
  - Validations: name presence, uniqueness, length (2-100 chars)
  - Associations: `has_many :professionals` with `dependent: :restrict_with_error`
  - Scopes: `active`, `ordered` (by name)
  - Callbacks: `normalize_name` (titleize before validation)

- **app/models/professional.rb**
  - Added: `belongs_to :specialty`
  - Changed validation: `validates :specialty_id, presence: { message: "deve ser selecionada" }`
  - Removed: old `validates :specialty` string validation

#### 3. GraphQL Schema

**Types:**
- **app/graphql/types/specialty_type.rb**
  - Fields: id, name, description, active, timestamps
  - Computed field: `professionals_count` (number of professionals using this specialty)

- **app/graphql/types/professional_type.rb**
  - Added fields: `specialty_id`, `specialty` (SpecialtyType object), `specialty_name` (computed)
  - Removed: old string `specialty` field

**Queries (app/graphql/types/query_type.rb):**
- `specialties(includeInactive: Boolean)`: List all specialties
- `specialty(id: ID!)`: Get single specialty by ID
- Updated `professionals_by_specialty`: Now filters by `specialty_id` FK instead of string match

**Mutations:**
- **app/graphql/mutations/create_specialty.rb**: Create new specialty
  - Arguments: `name` (required), `description` (optional)
  - Returns: specialty object or errors array

- **app/graphql/mutations/update_specialty.rb**: Update existing specialty
  - Arguments: `id` (required), `name`, `description`, `active` (all optional)
  - Returns: specialty object or errors array

- **app/graphql/mutations/delete_specialty.rb**: Soft delete (deactivate) specialty
  - Checks for linked professionals before deactivation
  - Returns: success boolean and errors array

- **app/graphql/mutations/create_professional.rb**: Updated to accept `specialtyId` instead of `specialty` string
- **app/graphql/mutations/update_professional.rb**: Updated to accept `specialtyId` instead of `specialty` string

#### 4. Schema Registration
- Added specialty mutations to `app/graphql/types/mutation_type.rb`:
  - `create_specialty`
  - `update_specialty`
  - `delete_specialty`

### Frontend Changes

#### 1. GraphQL Queries (src/lib/graphql.ts)
Added new queries and mutations:
```typescript
SPECIALTIES_QUERY
SPECIALTY_QUERY
CREATE_SPECIALTY_MUTATION
UPDATE_SPECIALTY_MUTATION
DELETE_SPECIALTY_MUTATION
```

Updated professional queries to include:
- `specialtyId`
- `specialtyName`
- `specialty { id, name }`

Updated professional mutations to use `specialtyId` instead of `specialty` string.

#### 2. New Specialties Page (src/app/specialties/page.tsx)
Complete CRUD interface matching existing pages pattern:
- **Features:**
  - Filter by name, description, or ID
  - Pagination (5/10/20/50 items per page)
  - Create/Edit/Delete operations
  - Active/Inactive toggle
  - Professionals count badge
  - Protection: Only active specialties cannot be deleted if they have linked professionals

- **Components Used:**
  - `PageHeader`: Title, subtitle, "Nova Especialidade" button
  - `Table`: Sortable columns with filter and pagination
  - `Modal`: Create/Edit forms
  - `ConfirmDialog`: Delete confirmation
  - `StatusBadge`: Active/Inactive status display

#### 3. Sidebar Menu Update (src/components/Sidebar.tsx)
Added new expandable menu section:
- **Cadastros Gerais** (General Registrations)
  - Icon: 📋
  - Submenu:
    - **Especialidades** (Specialties) - Icon: 🎓 - Route: `/specialties`

Features:
- Collapsible submenu with smooth transitions
- Highlight when any submenu item is active
- Pre-expanded by default for easy access

#### 4. Professionals Page Update (src/app/professionals/page.tsx)
Changed from static array to dynamic database query:
- **Removed:** `const SPECIALTIES = ['Fonoaudiologia', 'Psicologia', ...]`
- **Added:** `useQuery(SPECIALTIES_QUERY)` to fetch from database
- **Updated form state:** `specialty` → `specialtyId`
- **Updated create/edit forms:** Dropdown now loads from `specialtiesData`
- **Updated table display:** Shows `specialtyName` (computed from relationship)
- **Updated filtering:** Filters by `specialtyName` instead of specialty object

## Data Migration Results

The migration successfully transferred existing professional specialties to the new table:
- Created distinct specialty records from existing professional data
- Linked all professionals to their corresponding specialty records via FK
- Zero data loss - all existing relationships preserved

**Validation (from Rails console):**
```ruby
Specialty.first.name
# => "Fisioterapia"

Specialty.first.professionals.count
# => 1

Professional.first.specialty.name
# => "Fonoaudiologia"
```

## Database Schema

### specialties table
```sql
CREATE TABLE specialties (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT index_specialties_on_name UNIQUE (name)
);
CREATE INDEX index_specialties_on_active ON specialties(active);
```

### professionals table (updated)
```sql
ALTER TABLE professionals 
  ADD COLUMN specialty_id BIGINT REFERENCES specialties(id);
```

## Validation Requirements

### Backend Validations
- Specialty `name`: required, unique, 2-100 characters, normalized with titleize
- Professional `specialty_id`: required (Portuguese error message: "deve ser selecionada")
- Specialty deletion: blocked if professionals linked (restrict_with_error)

### Frontend Validations
- Create professional form: `userId` and `specialtyId` required (button disabled if missing)
- Delete specialty: button disabled if `professionalsCount > 0`

## Build Status
✅ Frontend build successful (no TypeScript errors)
✅ Backend migrations applied successfully
✅ All GraphQL queries/mutations registered
✅ Model associations working correctly

## Files Modified/Created

### Backend (8 files)
1. `db/migrate/20251116000000_create_specialties.rb` (new)
2. `db/migrate/20251116000001_add_specialty_id_to_professionals.rb` (new)
3. `app/models/specialty.rb` (new)
4. `app/models/professional.rb` (modified)
5. `app/graphql/types/specialty_type.rb` (new)
6. `app/graphql/types/professional_type.rb` (modified)
7. `app/graphql/types/query_type.rb` (modified)
8. `app/graphql/types/mutation_type.rb` (modified)
9. `app/graphql/mutations/create_specialty.rb` (new)
10. `app/graphql/mutations/update_specialty.rb` (new)
11. `app/graphql/mutations/delete_specialty.rb` (new)
12. `app/graphql/mutations/create_professional.rb` (modified)
13. `app/graphql/mutations/update_professional.rb` (modified)

### Frontend (4 files)
1. `src/lib/graphql.ts` (modified - added specialty queries/mutations, updated professional queries)
2. `src/app/specialties/page.tsx` (new - complete CRUD page)
3. `src/components/Sidebar.tsx` (modified - added Cadastros Gerais menu)
4. `src/app/professionals/page.tsx` (modified - uses dynamic specialties)

## Next Steps (Optional Enhancements)

1. **Sorting:** Add sort functionality to specialties table (by name, professionals count, etc.)
2. **Bulk Operations:** Enable selecting multiple specialties for batch activate/deactivate
3. **Audit Log:** Track who created/modified each specialty and when
4. **Search Enhancement:** Add full-text search for specialty descriptions
5. **Usage Statistics:** Show which specialties are most/least used
6. **Import/Export:** Allow CSV import/export of specialties

## Testing Recommendations

1. **Create specialty** with duplicate name (should fail validation)
2. **Delete specialty** with linked professionals (should be blocked)
3. **Deactivate specialty** then try to select it in professional form (should not appear)
4. **Create professional** without selecting specialty (should show error)
5. **Filter/pagination** on specialties page with various data sizes
6. **Sidebar menu** expand/collapse behavior and active state highlighting
