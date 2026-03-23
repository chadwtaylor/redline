-- Redline: In-app dev feedback with element inspector
CREATE TABLE redlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id TEXT,
  page_url TEXT NOT NULL,
  element_selector TEXT NOT NULL,
  element_text TEXT,
  feedback TEXT NOT NULL,
  screenshot_path TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'fixed', 'dismissed', 'deferred')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_redlines_status ON redlines(status);
CREATE INDEX idx_redlines_page ON redlines(page_url);

ALTER TABLE redlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY redlines_select ON redlines FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY redlines_insert ON redlines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY redlines_update ON redlines FOR UPDATE
  USING (auth.uid() IS NOT NULL);

GRANT ALL ON redlines TO authenticated;
GRANT ALL ON redlines TO service_role;
