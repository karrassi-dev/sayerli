-- Trigger function: fires when `plan` column changes on entreprises table.
-- If upgraded to PRO/BUSINESS: sets planDebut = now, planExpiration = now + 1 month.
-- If downgraded to STARTER: clears both dates.
CREATE OR REPLACE FUNCTION set_plan_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    IF NEW.plan = 'STARTER' THEN
      NEW."planDebut"      := NULL;
      NEW."planExpiration" := NULL;
    ELSE
      NEW."planDebut"      := NOW();
      NEW."planExpiration" := NOW() + INTERVAL '1 month';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS trg_plan_dates ON entreprises;

CREATE TRIGGER trg_plan_dates
BEFORE UPDATE ON entreprises
FOR EACH ROW
EXECUTE FUNCTION set_plan_dates();
