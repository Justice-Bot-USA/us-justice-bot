-- Step 1: Delete any existing anonymous chat sessions and their messages
-- (This is necessary before we can make user_id NOT NULL)
DELETE FROM chat_messages WHERE session_id IN (
  SELECT id FROM chat_sessions WHERE user_id IS NULL
);
DELETE FROM chat_sessions WHERE user_id IS NULL;

-- Step 2: Make user_id NOT NULL in chat_sessions
ALTER TABLE chat_sessions ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Drop old permissive policies that allowed NULL user_id
DROP POLICY IF EXISTS "chat_sessions_insert_own" ON chat_sessions;
DROP POLICY IF EXISTS "chat_sessions_select_own" ON chat_sessions;
DROP POLICY IF EXISTS "chat_messages_insert_session_owner" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_session_owner" ON chat_messages;

-- Step 4: Create new strict policies for chat_sessions
CREATE POLICY "Users can insert their own chat sessions"
ON chat_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat sessions"
ON chat_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Create new strict policies for chat_messages
CREATE POLICY "Users can insert messages in their own sessions"
ON chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view messages in their own sessions"
ON chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

-- Step 6: Add admin policies for oversight
CREATE POLICY "Admins can view all chat sessions"
ON chat_sessions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all chat messages"
ON chat_messages
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));