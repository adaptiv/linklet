defmodule Pheddit.Link do
  use Pheddit.Web, :model

  @timestamps_opts [usec: false]

  schema "links" do
    field :title
    field :url

    timestamps
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:title, :url])
    |> validate_required([:title, :url])
  end
end
