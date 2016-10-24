defmodule Pheddit.Repo.Migrations.AddLinksTable do
  use Ecto.Migration

  def change do
    create table :links do
      add :title, :string
      add :url, :string

      timestamps
    end
  end
end
