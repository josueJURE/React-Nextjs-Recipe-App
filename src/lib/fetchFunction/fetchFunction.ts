type PostPayload = Record<string, unknown>;

const postJson = async <TResponse = unknown>(
  path: string,
  body: PostPayload
): Promise<TResponse> => {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `POST ${path} failed: ${JSON.stringify(error)}`
    );
  }

  return response.json();
};

export default postJson

